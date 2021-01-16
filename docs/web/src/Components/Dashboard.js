import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import Metric from "./Metric";

const useStyles = makeStyles({
    root: {
        backgroundColor: "#F5F5FB",
        padding: "30px 50px",
    },
    header: {
        color: "#94B143",
        fontSize: 20,
        margin: "0 0 50px 0",
    },
    labels: {
        color: "#87753F",
        fontSize: 17,
        fontWeight: "bold"
    }
});

function Dashboard() {
    const classes = useStyles();

    return (
    <Grid className={classes.root}>
        <h6 className={classes.header}>Dashboard</h6>
        <p className={classes.labels}>Your plant's progress</p>
        <Graph />
        <p className={classes.labels}>Helpful stats</p>
        <Grid container>
            <Grid item xs={4}><Metric /></Grid>
            <Grid item xs={4}><Metric /></Grid>
            <Grid item xs={4}><Metric /></Grid>
        </Grid>
    </Grid>
    )
}

export default Dashboard;