import React, {useRef, useState} from "react";
import {Chart} from "react-google-charts";

const options = {allowHtml: true,};
const ThreadsLoops = ( { experiments, generateChartElement } ) => {
  const chartRef = useRef();
  const [rows, setRows] = useState(null);
  const columns = [
    { type: "string", id: "Thread" },
    { type: "string", id: "Loop" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ];

  return (
    <Chart
      chartType="Timeline"
      data={[columns, ...experiments.map( (experiment) => generateChartElement(experiment) )]}
      options={options}
    />
  )
}

export default ThreadsLoops
