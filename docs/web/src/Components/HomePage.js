import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import ActivityLog from "./ActivityLog";
import Dashboard from "./Dashboard";

const useStyles = makeStyles(
    
);

function HomePage() {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12} lg={4}>
                <ActivityLog />
            </Grid>
            <Grid item xs={12} lg={8}>
                <Dashboard />
            </Grid>
        </Grid>
    )
}

export default HomePage;