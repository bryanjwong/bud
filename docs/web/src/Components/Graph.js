import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Chart from "chart.js";

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "Poppins"
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0.5;
//--Chart Style Options--//

const useStyles = makeStyles({
    metricbutton: {
        backgroundColor: "white",
        color: "#8bc34a",
        fontSize: 14,
        padding: "4px 20px",
        marginRight: "10px",
        fontFamily: "Poppins",
        textTransform: "none",
        borderRadius: 10,
        // float: "left",
        "&:hover": {
            backgroundColor: "#8bc34a",
            color: "white"
        },
    }
});

function Graph(props) {
    const classes = useStyles();
    const chartRef = React.createRef();

    const [displayedMetric, setDisplayedMetric] = useState("Soil Moisture");

    const dims = {
        "Soil Moisture": {
            y_label: "Soil Moisture (%)",
            data: props.soilMoistureData,
            lowGradient: "rgb(96, 188, 177, 0.2)",
            highGradient: "rgb(122, 206, 250, 1.0)"
        },
        "Humidity": {
            y_label: "Air Humidity (%)",
            data: props.humidityData,
            lowGradient: "rgb(167, 191, 232, 0.2)",
            highGradient: "rgb(97, 144, 232, 1.0)"
        },
        "Temperature": {
            y_label: "Temperature (°F)",
            data: props.tempData,
            lowGradient: "rgb(255, 195, 160, 0.2)",
            highGradient: "rgb(255, 175, 189, 1.0)"
        },
        "Luminance": {
            y_label: "Luminance (lx)",
            data: props.lightData,
            lowGradient: "rgb(255, 210, 0, 0.2)",
            highGradient: "rgb(247, 151, 30, 1.0)"
        }
    };

    useEffect(() => {
        const myChartRef = chartRef.current.getContext("2d");
        const {height: graphHeight} = myChartRef.canvas;
        let gradientLine = myChartRef.createLinearGradient(0, 0, 0, graphHeight);
        gradientLine.addColorStop(0, dims[displayedMetric].lowGradient);
        gradientLine.addColorStop(1, dims[displayedMetric].highGradient);

        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                datasets: [
                    {
                        label: displayedMetric,
                        data: dims[displayedMetric].data,
                        borderColor: gradientLine,
                        backgroundColor: gradientLine,
                    }
                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            tooltipFormat: "MMM D, h:mm a"
                        },
                        bounds: 'data',
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                            fontColor: '#87753F',
                            fontSize: 16,
                        },
                        ticks: { 
                            display: true,
                            maxTicksLimit: 10,
                            maxRotation: 0,
                        },
                        gridLines: {
                            display: false,
                            drawBorder: true
                        }
                    }],
                    yAxes: [{    
                        offset: true,
                        scaleLabel: {
                            display: true,
                            labelString: dims[displayedMetric].y_label,
                            fontColor: '#87753F',
                            fontSize: 16,
                        }, 
                        ticks: { 
                            display: true,
                            // suggestedMin: 30,
                            // suggestedMax: 80, 
                        },
                        gridLines: {
                            display: true,
                            drawBorder: false
                        },
                    }]
                },
                tooltips: {
                    displayColors: false,
                },
            }
        });
    });

    var soilMoistureStyle = (displayedMetric === "Soil Moisture") ? {backgroundColor:" #8bc34a", color: "white"} : {};
    var humidityStyle = (displayedMetric === "Humidity") ? {backgroundColor:" #8bc34a", color: "white"} : {};
    var tempStyle = (displayedMetric === "Temperature") ? {backgroundColor:" #8bc34a", color: "white"} : {};
    var lightStyle = (displayedMetric === "Light") ? {backgroundColor:" #8bc34a", color: "white"} : {};

    return (
    <Grid container>
        {/* <Grid item xs={3}>
            <p className={classes.labels}>Your plant's progress</p>
        </Grid> */}
        <Grid item xs={10}>
            <Button id="b1" className={classes.metricbutton} style={soilMoistureStyle} onClick={() => setDisplayedMetric("Soil Moisture")}>Soil Moisture</Button>
            <Button id="b2" className={classes.metricbutton} style={humidityStyle} onClick={() => setDisplayedMetric("Humidity")}>Humidity</Button>
            <Button id="b3" className={classes.metricbutton} style={tempStyle} onClick={() => setDisplayedMetric("Temperature")}>Temperature</Button> 
            <Button id="b4" className={classes.metricbutton} style={lightStyle} onClick={() => setDisplayedMetric("Luminance")}>Light</Button>
        </Grid>
        <Grid item xs={10}>
            <div>
                <canvas
                    id="myChart"
                    ref={chartRef}
                />
            </div>
        </Grid>
    </Grid>
    );
}

export default Graph;