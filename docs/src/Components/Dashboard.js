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
    },
    plantButton: {
        backgroundColor: "#8bc34a",
        color: "white",
        fontSize: 18,
        padding: "4px 20px",
        fontFamily: "Poppins",
        textTransform: "none",
        borderRadius: 10,
        float: "right",
        "&:hover": {
            backgroundColor: "#17402e",
        },
    }
});

function Dashboard(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState("");
    const [idealSoilMoisture, setIdealSoilMoisture] = useState(40)
    const [idealHumidity, setIdealHumidity] = useState(40);
    const [idealTemp, setIdealTemp] = useState(50);
    const [idealLight, setIdealLight] = useState(10);
    const [precipitation, setPrecipitation] = useState("N/A");
    const [minRootDepth, setMinRootDepth] = useState("N/A");
    const [phRange, setPhRange] = useState("N/A");
    const [nutriments, setNutriments] = useState("N/A");

    var soilMoistureStr = (props.soilMoistureData.length > 0) ? props.soilMoistureData.slice(-1)[0].y+"%" : "?";
    var humidityStr = (props.humidityData.length > 0) ? props.humidityData.slice(-1)[0].y+"%" : "?";
    var tempStr = (props.tempData.length > 0) ? props.tempData.slice(-1)[0].y+"°F" : "?";
    var lightStr = (props.lightData.length > 0) ? props.lightData.slice(-1)[0].y+"lx" : "?";

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    async function handleChange(e) {
        const plantResp = await props.searchPlant(e.target.value);
        const growthInfo = plantResp.data.data.growth;
        setSelectedPlant(e.target.value);
        if (growthInfo.soil_humidity) setIdealSoilMoisture(growthInfo.soil_humidity);
        if (growthInfo.atmospheric_humidity) setIdealHumidity(growthInfo.atmospheric_humidity * 10);
        if (growthInfo.minimum_temperature) setIdealTemp(growthInfo.minimum_temperature.deg_f);
        if (growthInfo.light) setIdealLight(growthInfo.light * 4);
        if (growthInfo.minimum_precipitation) setPrecipitation(growthInfo.minimum_precipitation.mm+"mm/yr");
        if (growthInfo.minimum_root_depth) setMinRootDepth(growthInfo.minimum_root_depth.cm);
        if (growthInfo.ph_minimum && growthInfo.ph_maximum) setPhRange(growthInfo.ph_minimum+" - "+growthInfo.ph_maximum)
        if (growthInfo.soil_nutriments) setNutriments(growthInfo.soil_nutriments);
    }

    const handleClickPlant = () => {
        if (selectedPlant === "") return;
        props.createNewPlant(selectedPlant);
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
        <p className={classes.labels}>Your {props.species.toLowerCase()}'s progress</p>
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
                                        onChange={handleChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Sunflower">Sunflower</MenuItem>
                                    <MenuItem value="Daisy">Daisy</MenuItem>
                                    <MenuItem value="Garden Tomato">Garden Tomato</MenuItem>
                                    </Select>
                                </FormControl>
                                <p className={classes.modalConditionHeader}>Find out its ideal conditions</p>
                                <p className={classes.modalConditions}>Soil Moisture: {idealSoilMoisture}%</p>
                                <p className={classes.modalConditions}>Humidity: {idealHumidity}%</p>
                                <p className={classes.modalConditions}>Min Temperature: {idealTemp}°F</p>
                                <p className={classes.modalConditions}>Light: {idealLight} lx</p>
                                <p className={classes.modalConditions}>Precipitation: {precipitation}</p>
                                <p className={classes.modalConditionHeader}>Planting Tips:</p>
                                <p className={classes.modalConditions}>Min Root Depth: {minRootDepth} cm</p>
                                <p className={classes.modalConditions}>Soil pH: {phRange}</p>
                                <p className={classes.modalConditions}>Soil Nutriments: {nutriments}</p>
                            </Grid>
                            <Grid item xs={4}>
                                <img src={plant} className={classes.image}/>
                            </Grid>
                        </Grid>
                        <Button startIcon={<AddIcon />}
                                    className={classes.plantButton}
                                    onClick={handleClickPlant}>Plant it!</Button>
                    </DialogContent>
        </Dialog>
    </Grid>
    )
}

export default Dashboard;