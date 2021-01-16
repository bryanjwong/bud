import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        padding: 15,
        borderRadius: 10,
        textAlign: "center"
    },
    label: {
        color: "#87753F",
        fontSize: 15,
        margin: "10px 0 0 0",
        fontWeight: "bold"
    },
    actual: {
        color: "#7EA7CB",
        fontSize: 35,
        margin: 0,
    },
    target: {
        color: "#94B143",
        fontSize: 35,
        margin: 0,
    },
    actualSublabel: {
        color: "#7EA7CB",
        margin: 0,
    },
    targetSublabel: {
        color: "#94B143",
        margin: 0,
    }
});

function Metric(props) {
    const classes = useStyles();

    return (
        <Paper elevation={0} className={classes.root}>
            <Grid container>
                <Grid item xs={6}>
                    <p className={classes.actual}>54</p>
                    <p className={classes.actualSublabel}>Actual</p>
                </Grid>
                <Grid item xs={6}>
                {/* <div style={{borderLeft: "1px solid green", height: "50px"}}></div> */}
                    <p className={classes.target}>35</p>
                    <p className={classes.targetSublabel}>Target</p>
                </Grid>
                <Grid item xs={12}>
                    <p className={classes.label}>{props.metric}</p>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Metric;