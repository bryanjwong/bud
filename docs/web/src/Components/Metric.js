import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(
    
);

function Metric() {
    const classes = useStyles();

    return (
        <Grid container>
            I am a metric!
        </Grid>
    )
}

export default Metric;