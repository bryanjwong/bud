import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
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

function Dashboard() {
    const classes = useStyles();

    useEffect(() => {
        axios
        .get("https://trefle.io/api/v1/plants?token=R8xZcZH6j9PoyOTqoGc_Pndhdvx6nM1aD7FGHYBQc2M", {
            method: 'HEAD',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            console.log("hello");
        });
    }, []);
    // useEffect(() => {
    //     fetch("/api/v1/plants?token=R8xZcZH6j9PoyOTqoGc_Pndhdvx6nM1aD7FGHYBQc2M")
    //     .then(res => res.json())
    //     .then(
    //         (result) => {
    //             console.log(result)
    //         }
    //     )
    // }, []);

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
            <Grid item xs={3}><Metric metric="Temperature"/></Grid>
            <Grid item xs={3}><Metric metric="Humidity"/></Grid>
            <Grid item xs={3}><Metric metric="Light"/></Grid>
        </Grid>
    </Grid>
    )
}

export default Dashboard;