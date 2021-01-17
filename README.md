# bud - IDEA Hacks 2021 AudioVisual Category Grand Prize Winner
![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/355/753/datas/gallery.jpg)

#### Kathy Daniels and Bryan Wong
### [Dashboard](https://bryanjwong.github.io/bud/) | [Demo Video](https://youtu.be/a44sxq7Y4WQ) | [DevPost](https://devpost.com/software/bud-pq9jdr) | [Slide Deck](https://docs.google.com/presentation/d/1ApXYLpTveTEwwH3yQijMfoTFlVSydzYXCT7clnN1dxA/edit?usp=sharing)

## Introduction
Amidst the new era of quarantine, millions throughout the world have turned to new hobbies to keep themselves occupied. Among the most popular of these quarantine hobbies is gardening, a favorite among many college students. More than ever, house plants are seeing a huge surge of popularity. It isn't that easy, however— whether it's through underwatering, overwatering, poor soil conditions, or inadequate lighting, many rookie gardeners have killed their beloved plants. But fear not, green thumbed friends... bud is here to help out!

## About bud
![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/347/287/datas/gallery.jpg)

bud is an IoT gardening assistant that makes tending house plants a breeze for everyone. Your plant's "buddy" device uses a variety of sensors to monitor its soil moisture, air humidity, temperature, and light intensity conditions. The buddy leverages the ESP32's WiFi capabilities to periodically read and write sensor data to a Google Firebase database. In addition, users can use the [bud website](https://bryanjwong.github.io/bud/) to load a unique profile for their plant, which contain target values for each metric. If these target values are not met (e.g. the soil is too dry), the buddy will light up an LED and play a sound alert, allowing the user to correct the issue. The buddy also uses an OLED display to show these metrics and other information.

The [bud website](https://bryanjwong.github.io/bud/) allows users to visualize the emitted sensor data  using a beautiful React frontend. These metrics are displayed in an elegant ChartJs Line Graph and a plant dashboard. In the case of an issue, the activity log will display various alerts with information on how to correct the problem. Users can also use the bud website to configure the system for their specific plant. bud uses the Trefle plant API to search for optimal growth conditions for the user's choice of plant, uploading the results to the synced Firebase database.

## ESP32 (esp32/)
![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/347/288/datas/gallery.jpg)

`bud.ino` runs on the ESP32 and is responsible for managing all of the buddy's sensors and hardware components. The ESP32 uses the I2C protocol to read and write from/to the Light Sensor and OLED display. It reads and writes metrics to our Google Firebase database and uses the NTPClient library to write accurate timestamped data. 

Parts:
* DOIT Esp32 DevKit v1
* Adafruit SSD1306 OLED Display
* Soil Moisture Sensor
* DHT11 Temperature/Humidity Sensor
* BH1750 Light Sensor
* Piezo Buzzer
* Green LED

Libraries:
* [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306)
* [BH1750](https://github.com/claws/BH1750)
* [DHT-sensor-library](https://github.com/adafruit/DHT-sensor-library)
* [IOXhop_FirebaseESP32](https://github.com/ioxhop/IOXhop_FirebaseESP32)
* [NTPClient](https://github.com/taranais/NTPClient)

## React Frontend (docs/)
![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/347/241/datas/gallery.jpg)

The frontend for our website is responsible for performing various calls to the [Trefle API](https://docs.trefle.io/) and the Google Firebase API. Due to CORS issues with the Trefle API, we routed those API calls through [cors-anywhere](https://github.com/Rob--W/cors-anywhere). We display our metrics and other info using React.js with various material-ui components. We use Chart.js to build our metrics Line graph. The website is hosted on Github Pages.

Libraries:
* [React.js](https://reactjs.org/)
* [material-ui](https://material-ui.com/)
* [Chart.js](https://www.chartjs.org/)
* [axios](https://www.npmjs.com/package/axios)
* [firebase](https://firebase.google.com/docs/reference)

## Improvements 
There are a number of improvements and extensions that we can apply to bud. Here are just a few ideas:
* Manufacture a PCB
* 3D Print a chassis to house the buddy
* Automate watering when soil moisture is sufficiently low
* Send text notifications
* Create mobile app to sync with database
