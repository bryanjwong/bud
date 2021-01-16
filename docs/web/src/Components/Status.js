import { makeStyles } from "@material-ui/core";
import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    root: {
        backgroundColor: "white",
        padding: "10px 30px",
        borderRadius: 15,
        color: "#9C7E95",
        marginBottom: 15,
        fontSize: 14,
    },
});

function Status() {
    const classes = useStyles();

    return (
        <Paper elevation={5} className={classes.root}>
            <Grid container>
                <Grid item xs={8}>
                    Water your plants!
                </Grid>
                <Grid item xs={4}>
                    2021-01-15
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Status;