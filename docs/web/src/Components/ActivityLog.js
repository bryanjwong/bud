import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Status from './Status';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#94B143",
        padding: "30px 50px",
    },
    header: {
        color: "white",
        fontSize: 20,
        margin: "0 0 50px 0",
    },
    labels: {
        color: "white",
        marginBottom: 20,
        fontSize: 16,
        paddingLeft: 30,
    }
});

function ActivityLog() {
    const classes = useStyles();

    return (
    <Grid className={classes.root}>
        <h6 className={classes.header}>Activity Log</h6>
        <Grid container>
            <Grid item xs={8} className={classes.labels}>Status</Grid>
            <Grid item xs={4} className={classes.labels}>Time</Grid>
        </Grid>
        <Status />
        <Status />
        <Status />
    </Grid>
    )
}

export default ActivityLog;