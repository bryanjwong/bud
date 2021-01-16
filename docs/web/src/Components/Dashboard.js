import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import Button from '@material-ui/core/Button';
import Metric from "./Metric";
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";

const useStyles = makeStyles({
    root: {
        backgroundColor: "#F5F5FB",
        padding: "30px 60px",
        height: "100vh",
    },
    header: {
        color: "#94B143",
        fontSize: 20,
        margin: "0 0 35px 0",
    },
    labels: {
        color: "#87753F",
        fontSize: 17,
        fontWeight: "bold"
    },
    button: {
        backgroundColor: "white",
        color: "#8bc34a",
        fontSize: 14,
        padding: "4px 20px",
        fontFamily: "Poppins",
        textTransform: "none",
        borderRadius: 10,
        float: "right",
        "&:hover": {
            backgroundColor: "#8bc34a",
            color: "white"
        },
    }
});

const proxyurl = "https://cors-anywhere.herokuapp.com/";

function Dashboard() {
    const classes = useStyles();
    const [tSoilMoisture, setTSoilMoisture] = useState(40);
    const [tHumidity, setTHumidity] = useState(40);
    const [tTemp, setTTemp] = useState(50);
    const [tLight, setTLight] = useState(10);

    async function createNewPlant(name) {
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
        console.log(plantId);
    
        const plantResp = await axios 
            .get(proxyurl + `https://trefle.io/api/v1/species/${plantId}?token=R8xZcZH6j9PoyOTqoGc_Pndhdvx6nM1aD7FGHYBQc2M`);
        const plantInfo = plantResp.data.data;
        const growthInfo = plantInfo.growth;
        console.log(plantInfo.growth); 

        if (growthInfo.soil_humidity) setTSoilMoisture(growthInfo.soil_humidity);
        if (growthInfo.atmospheric_humidity) setTHumidity(growthInfo.atmospheric_humidity * 10);
        if (growthInfo.minimum_temperature) setTTemp(growthInfo.minimum_temperature.deg_f);
        if (growthInfo.light) setTLight(growthInfo.light * 4);
    };

    useEffect(() => {
        createNewPlant('Sunflower');
    }, []);

    return (
    <Grid className={classes.root}>
        <Grid container>
            <Grid item xs={6}>
                <h6 className={classes.header}>Dashboard</h6>
            </Grid>
            <Grid item xs={6}>
                <Button startIcon={<AddIcon />} className={classes.button}>Track a new plant</Button>
            </Grid>
        </Grid>
        <p className={classes.labels}>Your plant's progress</p>
        <Graph />
        <p className={classes.labels}>Helpful stats</p>
        <Grid container spacing={2}>
            <Grid item xs={3}><Metric metric="Soil Moisture" actual={40} target={tSoilMoisture}/></Grid>
            <Grid item xs={3}><Metric metric="Temperature" actual={40} target={tTemp}/></Grid>
            <Grid item xs={3}><Metric metric="Humidity" actual={40} target={tHumidity}/></Grid>
            <Grid item xs={3}><Metric metric="Light" actual={40} target={tLight}/></Grid>
        </Grid>
    </Grid>
    )
}

export default Dashboard;