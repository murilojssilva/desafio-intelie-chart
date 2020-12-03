import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chart from './components/Chart';
import Editor from './components/Editor';
import NavBar from './components/NavBar';

export default function App() {
  const chartTypeEnum = {
    START: 'start',
    STOP: 'stop',
    SPAN: 'span',
    DATA: 'data'
  }
  const initialJSON = `{"type": "start", "timestamp": 1519862400000, "select": ["min_response_time", "max_response_time"], "group": ["os", "browser"]}
  {"type": "span", "timestamp": 1519862400000, "begin": 1519862400000, "end": 1519862460000}
  {"type": "data", "timestamp": 1519862400000, "os": "linux", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.3}
  {"type": "data", "timestamp": 1519862400000, "os": "mac", "browser": "chrome", "min_response_time": 0.2, "max_response_time": 1.2}
  {"type": "data", "timestamp": 1519862400000, "os": "mac", "browser": "firefox", "min_response_time": 0.3, "max_response_time": 1.2}
  {"type": "data", "timestamp": 1519862400000, "os": "linux", "browser": "firefox", "min_response_time": 0.1, "max_response_time": 1.0}
  {"type": "data", "timestamp": 1519862460000, "os": "linux", "browser": "chrome", "min_response_time": 0.2, "max_response_time": 0.9}
  {"type": "data", "timestamp": 1519862460000, "os": "mac", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.0}
  {"type": "data", "timestamp": 1519862460000, "os": "mac", "browser": "firefox", "min_response_time": 0.2, "max_response_time": 1.1}
  {"type": "data", "timestamp": 1519862460000, "os": "linux", "browser": "firefox", "min_response_time": 0.3, "max_response_time": 1.4}
  {"type": "stop", "timestamp": 1519862460000}`
  const initialData = React.useMemo(() => [],[])
  const initialAxes = React.useMemo(() => [{ primary: true, type: 'time', position: 'bottom'},{ type: 'linear', position: 'left' }],[]);
  const [json, setJson] = useState(initialJSON);
  const [data, setData] = useState(initialData);
  const [axes, setAxes] = useState(initialAxes);

  function setNewJSON(event){
    setJson(event.target.value)
  }

  function readJSON(){
    let jsonLines = json.split('\n');
    let stopPlot = true;
    let groups = [];
    let selects = [];
    let chartCoords = [];
    let defaultAxes = [{ primary: true, type: 'time', position: 'bottom'},{ type: 'linear', position: 'left' }];
    let axes = defaultAxes;
    let jsonLine;
    for(let line of jsonLines){
      try{
        jsonLine = JSON.parse(line);
      }catch(e){
        continue;
      }
      switch (jsonLine.type){
        case chartTypeEnum.DATA:
          if(!stopPlot){
            sortChartGroups(jsonLine, groups, selects, chartCoords)
          }
          break;
        case chartTypeEnum.SPAN:
          if(!stopPlot){
            axes = defineChartLimits(jsonLine)
          }
          break;
        case chartTypeEnum.START:
          stopPlot = false;
          chartCoords = [];
          axes = defaultAxes;
          groups = jsonLine.group;
          selects = jsonLine.select;
          break;
        case chartTypeEnum.STOP:
          stopPlot = true;
          break;
        default:
          console.log('type not found!')
      }
    }
    setChartLimits(axes);
    plotChart(chartCoords);
  }

  function defineChartLimits(jsonLine){
    let axes = [{ primary: true, type: 'time', position: 'bottom', hardMin: jsonLine.begin, hardMax: jsonLine.end},{ type: 'linear', position: 'left' }]
    return axes;
  }

  function setChartLimits(axes){
    setAxes(axes);
  }

  function sortChartGroups(jsonLine, groups, selects, chartCoords){
    let createNewEntry = true;
    if(chartCoords.length === 0){
      chartCoords.push({
        [groups[0]]: jsonLine[groups[0]],
        [groups[1]]: jsonLine[groups[1]],
        'timestamps': [jsonLine['timestamp']],
        [selects[0]]: [jsonLine[selects[0]]],
        [selects[1]]: [jsonLine[selects[1]]]
      })
    }else{
      for(let coord of chartCoords){
        createNewEntry = true;
        if(coord.hasOwnProperty([groups[0]]) && coord[groups[0]] === jsonLine[groups[0]]){
          if(coord.hasOwnProperty([groups[1]]) && coord[groups[1]] === jsonLine[groups[1]]){
            coord['timestamps'].push(jsonLine.timestamp);
            coord[selects[0]].push(jsonLine[selects[0]]);
            coord[selects[1]].push(jsonLine[selects[1]]);
            createNewEntry = false
            break;
          }
        }
      }
      if(createNewEntry){
        chartCoords.push({
          [groups[0]]: jsonLine[groups[0]],
          [groups[1]]: jsonLine[groups[1]],
          'timestamps': [jsonLine['timestamp']],
          [selects[0]]: [jsonLine[selects[0]]],
          [selects[1]]: [jsonLine[selects[1]]]
        })
      }
    }
  }

  function plotChart(chartCoords){
    let chartData = [];
    for(let coord of chartCoords){
      chartData.push(
        {label: `os ${coord.os} in browser ${coord.browser} min_response_time`,
      data: [
        [coord.timestamps[0], coord.min_response_time[0]], [coord.timestamps[coord.timestamps.length -1], coord.min_response_time[coord.min_response_time.length -1]]
      ]},
      {label: `os ${coord.os} in browser ${coord.browser} max_response_time`,
      data: [
        [coord.timestamps[0], coord.max_response_time[0]], [coord.timestamps[coord.timestamps.length -1], coord.max_response_time[coord.max_response_time.length -1]]
      ]}
      )
    }
    setData(chartData);
  }

  return (
    <Container fluid>
      <NavBar></NavBar>
      <div className="content-wrap">
        <Editor json={json} onChange={setNewJSON} onClick={readJSON}></Editor>
        <Chart data={data} json={json} axes={axes}></Chart>
      </div>
    </Container>
  );
}
