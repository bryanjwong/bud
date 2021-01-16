import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import Chart from "chart.js"

const useStyles = makeStyles({
});

function Graph() {
    const classes = useStyles();
    const chartRef = React.createRef();
    
    useEffect(() => {
        const myChartRef = chartRef.current.getContext("2d");
        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["Jan", "Feb", "March"],
                datasets: [
                    {
                        label: "Sales",
                        data: [86, 67, 91],
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    });

    return (<div>
        <canvas
                    id="myChart"
                    ref={chartRef}
                />
    </div>)
}

export default Graph;