import { makeStyles } from "@material-ui/core";
import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import OpacityIcon from '@material-ui/icons/Opacity';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';

const useStyles = makeStyles({
    root: {
        backgroundColor: "white",
        padding: "7px 30px",
        borderRadius: 15,
        color: "#9C7E95",
        marginBottom: 10,
        fontSize: 14,
    },
    date: {
        margin: 0,
        float: "right",
        paddingTop: 5
    }
});

function Status(props) {
    const classes = useStyles();
    // Determines icon based on whether stat is moisture/humidity/temp/light
    // Options: "moisture", "humidity", "temp", "light"
    const type = props.type

    return (
        <Paper elevation={5} className={classes.root}>
            <Grid container>
                <Grid item xs={1} style={{ marginTop: 3 }}>
                    {(type == "moisture") && <OpacityIcon />}
                    {(type == "humidity") && <CloudQueueIcon />}
                    {(type == "temp") && <AcUnitIcon />}
                    {(type == "light") && <WbSunnyIcon />}
                </Grid>
                <Grid item xs={7} style={{ paddingTop: 5 }}>
                    {props.message}
                </Grid>
                <Grid item xs={4}>
                    <p className={classes.date}>
                        {props.time.split("T")[1]}
                    </p>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Status;