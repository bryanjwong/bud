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

function Graph(props) {
    const classes = useStyles();
    const chartRef = React.createRef();

    const [displayedMetric, setDisplayedMetric] = useState("Soil Moisture");

    const dims = {
        "Soil Moisture": {
            y_label: "Soil Moisture (%)",
            data: props.soilMoistureData
        },
        "Humidity": {
            y_label: "Air Humidity (%)",
            data: props.humidityData
        },
        "Temperature": {
            y_label: "Temperature (°F)",
            data: props.tempData
        },
        "Luminance": {
            y_label: "Luminance (lx)",
            data: props.lightData
        }
    };

    useEffect(() => {
        const myChartRef = chartRef.current.getContext("2d");
        const {width: graphWidth} = myChartRef.canvas;
        let gradientLine = myChartRef.createLinearGradient(0, 0, graphWidth * 2, 0);
        gradientLine.addColorStop(0, "#60BCB9");
        gradientLine.addColorStop(1, "#7ACEFA");

        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                datasets: [
                    {
                        label: displayedMetric,
                        data: dims[displayedMetric].data,
                        fill: false,
                        borderColor: gradientLine,
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
                            // unit: 'minute',
                            tooltipFormat: "MMM D, h:mm a"
                        },
                        bounds: 'data',
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                            fontColor: '#87753F',
                        },
                        ticks: { display: true },
                        gridLines: {
                            display: false,
                            drawBorder: true
                        }
                    }],
                    yAxes: [{    
                        scaleLabel: {
                            display: true,
                            labelString: dims[displayedMetric].y_label,
                            fontColor: '#87753F',
                        }, 
                        ticks: { 
                            display: true,
                            suggestedMin: 30,
                            suggestedMax: 80, 
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

    return (
    <Grid container>
        <Grid item xs={3}>
            <p className={classes.labels}>Your plant's progress</p>
        </Grid>
        <Grid item xs={2}>
            <Button className={classes.metricbutton} onClick={() => setDisplayedMetric("Soil Moisture")}>Soil Moisture</Button>
        </Grid>
        <Grid item xs={2}>
            <Button className={classes.metricbutton} onClick={() => setDisplayedMetric("Humidity")}>Humidity</Button>
        </Grid>
        <Grid item xs={2}>
            <Button className={classes.metricbutton} onClick={() => setDisplayedMetric("Temperature")}>Temperature</Button>
        </Grid>
        <Grid item xs={2}>
            <Button className={classes.metricbutton} onClick={() => setDisplayedMetric("Luminance")}>Light</Button>
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