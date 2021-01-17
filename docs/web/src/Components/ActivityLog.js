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

    var soilMoistureStr = (props.soilMoistureData.length > 0) ? props.soilMoistureData.slice(-1)[0].y : "?";
    var humidityStr = (props.humidityData.length > 0) ? props.humidityData.slice(-1)[0].y : "?";
    var tempStr = (props.tempData.length > 0) ? props.tempData.slice(-1)[0].y : "?";
    var lightStr = (props.lightData.length > 0) ? props.lightData.slice(-1)[0].y : "?";

    return (
    <Grid className={classes.root}>
        <h6 className={classes.header}>Activity Log</h6>
        <Grid container>
            <Grid item xs={8} className={classes.labels}>Status</Grid>
            <Grid item xs={4} className={classes.labels}>Time</Grid>
        </Grid>
        {(soilMoistureData.length > 0) && <Status />}
        {(humidityData.length > 0) && <Status />}
        {(tempData.length > 0) && <Status />}
        {(lightData.length > 0) && <Status />}
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