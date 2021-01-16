#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h>
#include <DHT.h>
#include <WiFi.h> 
#include <Wire.h>
#include <splash.h>

/* WiFi Constants */
#define WIFI_SSID "neptulon TP"
#define WIFI_PASSWORD "engjoo123"   

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

    // Initialize OLED Display
    display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.clearDisplay();
    display.setCursor(3, 10);
    display.drawBitmap((128 - splash1_width) / 2, (64 - splash1_height) / 2,
      splash1_data, splash1_width, splash1_height, 1);
    display.startscrollright(0x00, 0x0F);
    display.display();

    // Initialize Sensors
    dht.begin();
    lightMeter.begin();
}

/* Read soil moisture, humidity, temp, and light sensors */
void sense() {
  soil_moisture = analogRead(SOIL_MOISTURE_PIN)/4096.0 * 100;
  humidity = dht.readHumidity();
  temp = dht.readTemperature(true);
  light = lightMeter.readLightLevel();
}

void loop() {
    sense();
    delay(1000);
    Serial.println("Soil Moisture: " + String(soil_moisture) + " %");
    Serial.println("Humidity: " + String(humidity) + " %");
    Serial.println("Temperature: " + String(temp) + "°F");
    Serial.println("Illuminance: " + String(light) + " lx\n");
}
