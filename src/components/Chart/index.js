import React, { useMemo } from "react"
import { Chart } from "react-charts"
import { Div } from "./styles" 
export default function LineChart(props) {
  const data = props.data
  const axes = props.axes
  const memoizedValue = useMemo(() => [{showLine: true}], [])
  let lineChart = (
    <Div />
  );
  if(props.data.length > 0){
    lineChart = (
      <Div >
        <Chart id="chart" data={data} axes={axes} primaryCursor={memoizedValue} tooltip/>
      </Div>
    )
  }
  return lineChart;
}