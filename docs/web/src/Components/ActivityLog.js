import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Status from './Status';
import budLogo from '../bud.png';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#94B143",
        padding: "30px 35px",
        height: "100vh",
    },
    header: {
        color: "white",
        fontSize: 20,
        margin: "0 0 50px 0",
    },
    labels: {
        color: "white",
        marginBottom: 10,
        fontSize: 16,
        paddingLeft: 30,
        paddingRight: 30,
    },
    footer: {
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        color: "white",
        marginLeft: 25,
        fontWeight: "bold",
    },
    logo: {
        width: "40px",
        height: "40px"
    }
});

function ActivityLog(props) {
    const classes = useStyles();
    const tSoilMoisture = props.tSoilMoisture;
    const tHumidity = props.tHumidity;
    const tTemp = props.tTemp;
    const tLight = props.tLight;
    const soilMoistureData = props.soilMoistureData;
    const humidityData = props.humidityData;
    const tempData = props.tempData;
    const lightData = props.lightData;

    function getDateString() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return (dd + "/" + mm + "/" + yyyy);
    }

    return (
    <Grid className={classes.root}>
        <h6 className={classes.header}>Activity Log for {getDateString()}</h6>
        <Grid container>
            <Grid item xs={8} className={classes.labels}>
                Status
            </Grid>
            <Grid item xs={4} className={classes.labels}>
                <p style={{ margin: 0, float: "right" }}>Time</p>
            </Grid>
        </Grid>

        {/* SOIL MOISTURE STATUS */}
        {(soilMoistureData.length > 0) && 
         (soilMoistureData.slice(-1)[0].y < tSoilMoisture) && 
         <Status message="Moisture is low: Water your plant!"
                 time={soilMoistureData.slice(-1)[0].t}
         />}

        {/* HUMIDITY STATUS */}
        {(humidityData.length > 0) && 
         (humidityData.slice(-1)[0].y < tHumidity) &&
         <Status message="It's not humid enough!"
                 time={humidityData.slice(-1)[0].t}
         />}

        {/* TEMPERATURE STATUS */}
        {(tempData.length > 0) && 
         (tempData.slice(-1)[0].y < tTemp) &&
         <Status message="Temperature is getting colder!"
                 time={tempData.slice(-1)[0].t}
         />}

        {/* LIGHT STATUS */}
        {(lightData.length > 0) && 
         (lightData.slice(-1)[0].y < tLight) &&
         <Status message="Your plant needs more light!"
                 time={humidityData.slice(-1)[0].t}
         />}

        <div className={classes.footer}>
            <Grid container>
                <img src={budLogo} className={classes.logo}/>
                <h2 style={{margin: "10px 5px"}}>bud</h2>
            </Grid>
        </div>
    </Grid>
    )
}

export default ActivityLog;