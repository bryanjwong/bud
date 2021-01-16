#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h>
#include <DHT.h>
#include <IOXhop_FirebaseESP32.h>
#include <NTPClient.h>
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
unsigned long last_update = -600000;

/* OLED Constants */
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_ADDR       0x3C
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/* Sensor Constants */
#define SOIL_MOISTURE_PIN A0
#define DHTPIN 4     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

/* Network Time Protocol Constants */
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "us.pool.ntp.org");
String formattedDate;

/* Sensor Metrics */
float soil_moisture; // 0-100%
float humidity; // 0-100%
float temp; // Fahrenheit
float light; // Lx

void setup() {
    // put your setup code here, to run once:
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

    display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.display();

    dht.begin();
    lightMeter.begin();
    timeClient.begin();
}

/* Read soil moisture, humidity, temp, and light sensors */
void sense() {
  soil_moisture = analogRead(SOIL_MOISTURE_PIN)/4096.0 * 100;
  humidity = dht.readHumidity();
  temp = dht.readTemperature(true);
  light = lightMeter.readLightLevel();
}

/* Refresh OLED Display to show sensor metrics */
void update_display() {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Soil Moisture: " + String(soil_moisture) + " %");
    display.println("Humidity: " + String(humidity) + " %");
    display.println("Temperature: " + String(temp) + " F");
    display.println("Illuminance: " + String(light) + " lx\n");
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
    update_display();
    timeClient.update();
    formattedDate = timeClient.getFormattedDate();
    if (millis() - last_update >= UPDATE_PERIOD) {
        update_firebase();
        last_update = millis();
    }
    delay(1000);
//    print_data();
}
