import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import Button from '@material-ui/core/Button';
import Metric from "./Metric";
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import {db} from "../Services/Firebase"

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
    },
});

function Dashboard(props) {
    const classes = useStyles();

    var soilMoistureStr = (props.soilMoistureData.length > 0) ? props.soilMoistureData.slice(-1)[0].y : "?";
    var humidityStr = (props.humidityData.length > 0) ? props.humidityData.slice(-1)[0].y : "?";
    var tempStr = (props.tempData.length > 0) ? props.tempData.slice(-1)[0].y : "?";
    var lightStr = (props.lightData.length > 0) ? props.lightData.slice(-1)[0].y : "?";
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
        
        <Graph soilMoistureData={props.soilMoistureData} humidityData={props.humidityData} tempData={props.tempData} lightData={props.lightData}/>
        <p className={classes.labels}>Helpful stats</p>
        <Grid container spacing={2}>
            <Grid item xs={3}><Metric metric="Soil Moisture" actual={soilMoistureStr} target={props.tSoilMoisture}/></Grid>
            <Grid item xs={3}><Metric metric="Humidity" actual={humidityStr} target={props.tHumidity}/></Grid>
            <Grid item xs={3}><Metric metric="Temperature" actual={tempStr} target={props.tTemp}/></Grid>
            <Grid item xs={3}><Metric metric="Light" actual={lightStr} target={props.tLight}/></Grid>
        </Grid>
    </Grid>
    )
}

export default Dashboard;