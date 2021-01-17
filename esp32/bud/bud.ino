#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h>
#include <DHT.h>
#include <IOXhop_FirebaseESP32.h>
#include <NTPClient.h>
#include <pitches.h>
#include <splash.h>
#include <WiFi.h> 
#include <WiFiUdp.h>
#include <Wire.h>

/* WiFi Constants */
#define WIFI_SSID ""
#define WIFI_PASSWORD ""   

/* Firebase Constants */
#define FIREBASE_HOST ""
#define FIREBASE_AUTH ""
#define UPDATE_PERIOD 600000
unsigned long last_update = 2000 - UPDATE_PERIOD;
const String TARGET_PREFIX = "/active-plant/target/";

/* OLED Constants */
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_ADDR       0x3C
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define NUM_SCREENS 4
#define SWITCH_PERIOD 8000
unsigned long last_switch;
int screen_index = 0;

#define LOGO_WIDTH  60
#define LOGO_HEIGHT 19
static const unsigned char PROGMEM logo_bmp[] = {
  0x30, 0x00, 0x30, 0x30, 0x00, 0x00, 0x00, 0x30, 0x30, 0x00, 0x30, 0x30, 0x00, 0x00, 0x00, 0x30, 
  0xfc, 0x00, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 0xfc, 0x00, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 
  0xff, 0x03, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 0xff, 0x03, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 
  0xff, 0xcf, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 0xff, 0xcf, 0xfc, 0x30, 0x00, 0x00, 0x00, 0x30, 
  0x3f, 0xff, 0xf0, 0x30, 0x00, 0x00, 0x00, 0x30, 0x3f, 0xff, 0xf0, 0x33, 0xc3, 0x03, 0x0f, 0x30, 
  0x03, 0xff, 0x00, 0x33, 0xc3, 0x03, 0x0f, 0x30, 0x03, 0xff, 0x00, 0x3c, 0x33, 0x03, 0x30, 0xf0, 
  0x00, 0x30, 0x00, 0x3c, 0x33, 0x03, 0x30, 0xf0, 0x00, 0x30, 0x00, 0x30, 0x33, 0x03, 0x30, 0x30, 
  0x00, 0x30, 0x00, 0x30, 0x33, 0x03, 0x30, 0x30, 0x00, 0x30, 0x00, 0x30, 0x33, 0x03, 0x30, 0x30, 
  0x00, 0x30, 0x00, 0x30, 0x33, 0x03, 0x30, 0x30, 0x00, 0x30, 0x00, 0x3f, 0xc0, 0xfc, 0x0f, 0xf0, 
  0x00, 0x30, 0x00, 0x3f, 0xc0, 0xfc, 0x0f, 0xf0
};

/* Sensor Constants */
#define SOIL_MOISTURE_PIN A0
#define DHTPIN 4     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11
#define SAMPLE_PERIOD 1000
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

/* Network Time Protocol Constants */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "us.pool.ntp.org");
String formattedDate;

/* Sensor Metrics */
#define GREEN_LED 12
float soil_moisture; // 0-100%
float humidity; // 0-100%
float temp; // Fahrenheit
float light; // Lx

float target_soil_moisture = 40;
float target_humidity = 50;
float target_temp = 50;
float target_light = 10;

String species = "";
String scientific_name = "";
String status = "Everything OK!";

/* Speaker */
#define SPEAKER 26
const int CHANNEL = 0;
const int RESOLUTION = 8;
int NOTE_DUR = 78;

// Play a Note
void play(int note, int dur) {
    ledcWriteTone(CHANNEL, note);
    delay(dur * NOTE_DUR);
    ledcWriteTone(CHANNEL, 0);
    delay(dur * NOTE_DUR / 3);
}

void bootJingle() {
    play(NOTE_G5, 1);
    play(NOTE_E5, 1);
    play(NOTE_G5, 1);
    play(NOTE_C6, 1);
}

void alertJingle() {
    play(NOTE_C5, 2);
    play(NOTE_G5, 2);
}

void setup() {
    // put your setup code here, to run once:
    display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
    display.setTextColor(WHITE);
    display.clearDisplay();
    draw_logo();
    display.setCursor(15, LOGO_HEIGHT + 20);
    display.setTextSize(2);
    display.print("Welcome!");
    display.display();

    ledcSetup(CHANNEL, 2000, RESOLUTION);
    ledcAttachPin(SPEAKER, CHANNEL);
    ledcWrite(CHANNEL, 255);
    ledcWriteTone(CHANNEL, 2000);
    bootJingle();

    pinMode(GREEN_LED, OUTPUT);
    Serial.begin(115200);
    delay(1000);
    
    // Initialize WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to ");
    Serial.print(WIFI_SSID);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
    Serial.println();
    Serial.print("Connected to ");
    Serial.println(WIFI_SSID);
    Serial.print("IP Address is : ");
    Serial.println(WiFi.localIP());
    Serial.println();
    
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    target_soil_moisture = Firebase.getFloat(TARGET_PREFIX + "soil_moisture");
    target_humidity = Firebase.getFloat(TARGET_PREFIX + "humidity");
    target_temp = Firebase.getFloat(TARGET_PREFIX + "temp");
    target_light = Firebase.getFloat(TARGET_PREFIX + "light");
    species = Firebase.getString(TARGET_PREFIX + "species");
    scientific_name = Firebase.getString(TARGET_PREFIX + "scientific_name");

    dht.begin();
    lightMeter.begin();
    timeClient.begin();

    last_switch = millis();
}

/* Read soil moisture, humidity, temp, and light sensors */
void sense() {
    soil_moisture = analogRead(SOIL_MOISTURE_PIN)/4096.0 * 100;
    humidity = dht.readHumidity();
    temp = dht.readTemperature(true);
    light = lightMeter.readLightLevel();
}

/* Draw Bud Logo in top portion of OLED */
void draw_logo() {
    display.drawBitmap(
    (display.width()  - LOGO_WIDTH ) / 2, 0, 
    logo_bmp, LOGO_WIDTH, LOGO_HEIGHT, 1);
}

/* Refresh OLED to show Plant species and scientific name */
void display_plantname() {
    display.clearDisplay();
    draw_logo();
    display.setCursor(0, LOGO_HEIGHT + 10);
    display.setTextSize(1.5);
    display.println(species);
    display.setTextSize(1);
    display.println(scientific_name);
    display.println(status);
    display.display();
}

/* Refresh OLED to show sensor metrics */
void display_metrics() {
    display.clearDisplay();
    draw_logo();
    display.setCursor(0, LOGO_HEIGHT + 10);
    display.setTextSize(1);
    display.println("Soil Moisture: " + String(soil_moisture) + " %");
    display.println("Humidity: " + String(humidity) + " %");
    display.println("Temperature: " + String(temp) + " F");
    display.println("Illuminance: " + String(light) + " lx\n");
    display.display();
}

/* Refresh OLED to show temp/humidity */
void display_temphumidity() {
    display.clearDisplay();
    draw_logo();
    display.setCursor(0, LOGO_HEIGHT + 10);
    display.setTextSize(1);
    display.println("Temperature/Humidity");
    display.println();
    display.println("Target:" + String(target_temp) + "F/" + String(target_humidity) + "%");
    display.println("Actual:" + String(temp) + "F/" + String(humidity) + "%");
    display.display();
}

/* Refresh OLED to show temp/humidity */
void display_soillight() {
    display.clearDisplay();
    draw_logo();
    display.setCursor(0, LOGO_HEIGHT + 10);
    display.setTextSize(1);
    display.println("Moisture/Light");
    display.println();
    display.println("Target:" + String(target_soil_moisture) + "%/" + String(target_light) + "lx");
    display.println("Actual:" + String(soil_moisture) + "%/" + String(light) + "lx");
    display.display();
}

/* Upload Sensor data to Firebase */
void update_firebase() {
    Serial.println("Attempting to write to Firebase");
    String data = String(soil_moisture) + "," + String(humidity) + "," + String(temp) + "," + String(light);
    Firebase.setString("/active-plant/data/"+formattedDate, data);
    if (Firebase.failed()) {
      Serial.println(Firebase.error());  
      return;
    }
}

void check_status() {
    String issues = "";
    if (soil_moisture < target_soil_moisture) issues += "Moisture ";
    if (humidity < target_humidity) issues += "Humidity ";
    if (temp < target_temp) issues += "Temp ";
    if (light < target_light) issues += "Light ";
    if (issues == "") {
        status = "Everything OK!";
        digitalWrite(GREEN_LED, LOW);
    }
    else {
        status = issues + "too low!";
        digitalWrite(GREEN_LED, HIGH);
    }
}

/* Print Sensor Data to Serial Monitor */
void print_data() {
    Serial.println(formattedDate);
    Serial.println("Soil Moisture: " + String(soil_moisture) + " %");
    Serial.println("Humidity: " + String(humidity) + " %");
    Serial.println("Temperature: " + String(temp) + "°F");
    Serial.println("Illuminance: " + String(light) + " lx\n");
}

void loop() {
    sense();
    check_status();
    if (millis() - last_switch >= SWITCH_PERIOD) { // Loop through each screen
        screen_index = (screen_index + 1) % NUM_SCREENS;
        last_switch = millis();
    }
    switch (screen_index) {
        case 0: 
            display_plantname();
            break;
        case 1:
            display_metrics();
            break;
        case 2:
            display_temphumidity();
            break;
        case 3:
            display_soillight();
            break;
    }
    timeClient.update();
    formattedDate = timeClient.getFormattedDate();
    if (millis() - last_update >= UPDATE_PERIOD) {
        update_firebase();
        last_update = millis();
    }
    delay(SAMPLE_PERIOD);
//    print_data();
}
