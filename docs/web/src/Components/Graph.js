import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Chart from "chart.js"

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "Poppins"
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0.5;
//--Chart Style Options--//

const useStyles = makeStyles({
});

function Graph() {
    const classes = useStyles();
    const chartRef = React.createRef();
    
    var lookbackPeriod = 60000; // 1 Hour
    const min_t = Date.parse("2021-01-15T22:26:57Z") - lookbackPeriod;
    const newDate = new Date(min_t);
    console.log(newDate);
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
                // labels: [min_t, "2021-01-15T22:26:57Z"],
                datasets: [
                    {
                        label: "Humidity",
                        data: [{
                            t: "2021-01-15T22:24:47",
                            y: 43
                        },
                        {
                            t: "2021-01-15T22:25:52",
                            y: 51
                        },
                        {
                            t: "2021-01-15T22:26:57",
                            y: 46
                        }],
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
                            unit: 'minute',
                            tooltipFormat: "MMM D, h:mm a"
                        },
                        bounds: 'data',
                        ticks: { display: true },
                        gridLines: {
                            display: false,
                            drawBorder: true
                        }
                    }],
                    yAxes: [{     
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
                }
            }
        }); 
    });

    return (
    <Grid container>
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