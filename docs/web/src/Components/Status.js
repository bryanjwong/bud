import { makeStyles } from "@material-ui/core";
import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";

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
    }
});

function Status(props) {
    const classes = useStyles();

    return (
        <Paper elevation={5} className={classes.root}>
            <Grid container>
                <Grid item xs={8}>
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