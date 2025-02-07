import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import ActivityLog from "./ActivityLog";
import Dashboard from "./Dashboard";
import axios from "axios";
import {db} from "../Services/Firebase"

const useStyles = makeStyles(
    
);

const proxyurl = "https://cors-anywhere.herokuapp.com/";

function HomePage() {
    const classes = useStyles();

    const [tSoilMoisture, setTSoilMoisture] = useState(40);
    const [tHumidity, setTHumidity] = useState(40);
    const [tTemp, setTTemp] = useState(50);
    const [tLight, setTLight] = useState(10);
    const [soilMoistureData, setSoilMoistureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [lightData, setLightData] = useState([]);
    const [species, setSpecies] = useState("sunflower");

    async function searchPlant(name) {
        const searchResp = await axios
            .get(proxyurl + "https://trefle.io/api/v1/species/search?token=R8xZcZH6j9PoyOTqoGc_Pndhdvx6nM1aD7FGHYBQc2M", {
                params: {
                    q: name
                }
            });
        if (searchResp.data.data.length == 0) {
            console.log("No results found.");
            return;
        }
        const plantId = searchResp.data.data[0].id;
    
        const plantResp = await axios 
            .get(proxyurl + `https://trefle.io/api/v1/species/${plantId}?token=R8xZcZH6j9PoyOTqoGc_Pndhdvx6nM1aD7FGHYBQc2M`);
        return plantResp;
    };

    async function createNewPlant(name) {
        const plantResp = await searchPlant(name)
        if (!plantResp) return;
        const plantInfo = plantResp.data.data;
        const growthInfo = plantInfo.growth;
        
        const newSoilMoisture = (growthInfo.soil_humidity) ? (growthInfo.soil_humidity) : tSoilMoisture;
        const newHumidity = (growthInfo.atmospheric_humidity) ? growthInfo.atmospheric_humidity * 10 : tHumidity;
        const newTemp = (growthInfo.minimum_temperature) ? growthInfo.minimum_temperature.deg_f : tTemp;
        const newLight = (growthInfo.light) ? growthInfo.light * 4 : tLight;

        setSpecies(plantInfo.common_name);
        setTSoilMoisture(newSoilMoisture);
        setTHumidity(newHumidity);
        setTTemp(newTemp);
        setTLight(newLight);
        updateTargets(plantInfo.common_name, plantInfo.scientific_name, newSoilMoisture, newHumidity, newTemp, newLight);
    };

    function loadFirebaseData() {
        let soilMoisture = [];
        let humidity = [];
        let temp = [];
        let light = [];
        var query = db.ref("active-plant/data");
        query.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // key is ISO timestamp
                var key = childSnapshot.key;

                var data = childSnapshot.val().split(",");
                soilMoisture.push({t:key, y:parseInt(data[0])});
                humidity.push({t:key, y:parseInt(data[1])});
                temp.push({t:key, y:parseInt(data[2])});
                light.push({t:key, y:parseInt(data[3])});
            });
            setSoilMoistureData(soilMoisture);
            setHumidityData(humidity);
            setTempData(temp);
            setLightData(light);
        });

        query = db.ref("active-plant/target");
        query.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                switch(childSnapshot.key) {
                    case "soil_moisture": 
                        setTSoilMoisture(childSnapshot.val());
                        break;
                    case "humidity":
                        setTHumidity(childSnapshot.val());
                        break;
                    case "temp":
                        setTTemp(childSnapshot.val());
                        break;
                    case "light":
                        setTLight(childSnapshot.val());
                        break;
                    case "species":
                        setSpecies(childSnapshot.val());
                        break;
                }
            })
        });
    }

    function updateTargets(species, scientific_name, soilMoistureTarget, humidityTarget, tempTarget, lightTarget) {
        const today = new Date();
        db.ref("active-plant/target").set({
            soil_moisture: soilMoistureTarget,
            humidity: humidityTarget,
            temp: tempTarget,
            light: lightTarget,
            species: species,
            scientific_name: scientific_name,
            date_planted: today.toISOString()
        }); 
    }

    useEffect(() => {
        // createNewPlant('Sunflower');
        loadFirebaseData();   
    }, []);

    return (
        <Grid container>
            <Grid item xs={12} lg={4}>
                <ActivityLog 
                    tSoilMoisture={tSoilMoisture}
                    tHumidity={tHumidity}
                    tTemp={tTemp}
                    tLight={tLight}
                    soilMoistureData={soilMoistureData}
                    humidityData={humidityData}
                    tempData={tempData}
                    lightData={lightData}
                />
            </Grid>
            <Grid item xs={12} lg={8}>
                <Dashboard
                    species={species}
                    tSoilMoisture={tSoilMoisture}
                    tHumidity={tHumidity}
                    tTemp={tTemp}
                    tLight={tLight}
                    soilMoistureData={soilMoistureData}
                    humidityData={humidityData}
                    tempData={tempData}
                    lightData={lightData}
                    searchPlant={searchPlant} 
                    createNewPlant={createNewPlant}
                />
            </Grid>
        </Grid>
    )
}

export default HomePage;