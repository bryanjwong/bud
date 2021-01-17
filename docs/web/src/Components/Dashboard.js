import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import Button from '@material-ui/core/Button';
import Metric from "./Metric";
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import plant from '../newplant.png'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

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
    },
    image: {
        paddingTop: 20,
        width: 200,
        height: 200
    },
    modal: {
        padding: 30,
    },
    modalConditionHeader: {
        color: "#87753F",
        fontWeight: "bold",
        marginBottom: 5,
    },
    modalConditions: {
        color: "#87753F",
        margin: 0
    }
});

function Dashboard(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [species, setSpecies] = useState("sunflower");

    var soilMoistureStr = (props.soilMoistureData.length > 0) ? props.soilMoistureData.slice(-1)[0].y : "?";
    var humidityStr = (props.humidityData.length > 0) ? props.humidityData.slice(-1)[0].y : "?";
    var tempStr = (props.tempData.length > 0) ? props.tempData.slice(-1)[0].y : "?";
    var lightStr = (props.lightData.length > 0) ? props.lightData.slice(-1)[0].y : "?";

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
    <Grid className={classes.root}>
        {/* HEADER */}
        <Grid container>
            <Grid item xs={6}>
                <h6 className={classes.header}>Dashboard</h6>
            </Grid>
            <Grid item xs={6}>
                <Button startIcon={<AddIcon />}
                        className={classes.button}
                        onClick={handleClickOpen}>Track a new plant</Button>
            </Grid>
        </Grid>

        {/* CHART */}
        <p className={classes.labels}>Your {species}'s progress</p>
        <Graph soilMoistureData={props.soilMoistureData} humidityData={props.humidityData} tempData={props.tempData} lightData={props.lightData}/>
        
        {/* STATS */}
        <p className={classes.labels}>Helpful stats</p>
        <Grid container spacing={2}>
            <Grid item xs={3}><Metric metric="Soil Moisture" actual={soilMoistureStr} target={props.tSoilMoisture} color={"rgb(122, 206, 250, 1.0)"}/></Grid>
            <Grid item xs={3}><Metric metric="Humidity" actual={humidityStr} target={props.tHumidity} color={"rgb(97, 144, 232, 1.0)"}/></Grid>
            <Grid item xs={3}><Metric metric="Temperature" actual={tempStr} target={props.tTemp} color={"rgb(255, 175, 189, 1.0)"}/></Grid>
            <Grid item xs={3}><Metric metric="Light" actual={lightStr} target={props.tLight} color={"rgb(247, 151, 30, 1.0)"}/></Grid>
        </Grid>

        {/* MODAL */}
        <Dialog open={open} 
                onClose={handleClose}
                className={classes.modal}
                fullWidth={true}
                maxWidth='sm'>
                    <DialogContent className={classes.modal}>
                        <Grid container>
                            <Grid item xs={8}>
                                <h3 style={{ color: "#233F30", margin: "10px 0 0 0" }}>What species are you tracking?</h3>
                                <FormControl style={{minWidth: 150, marginTop: 2}}>
                                    <Select
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Plant 1">Plant 1</MenuItem>
                                    <MenuItem value="Plant 2">Plant 2</MenuItem>
                                    <MenuItem value="Plant 3">Plant 3</MenuItem>
                                    </Select>
                                </FormControl>
                                <p className={classes.modalConditionHeader}>Find out its ideal conditions</p>
                                <p className={classes.modalConditions}>Soil moisture</p>
                                <p className={classes.modalConditions}>Humidity</p>
                                <p className={classes.modalConditions}>Temperature</p>
                                <p className={classes.modalConditions}>Light</p>
                            </Grid>
                            <Grid item xs={4}>
                                <img src={plant} className={classes.image}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
        </Dialog>
    </Grid>
    )
}

export default Dashboard;