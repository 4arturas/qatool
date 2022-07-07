import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, Tooltip} from "antd";
import { Chart } from "react-google-charts";
import * as ReactDOM from 'react-dom';
import {Spin} from "antd/es";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar} from "@fortawesome/free-solid-svg-icons";

/*const options = {
  timeline: { showRowLabels: false },
  avoidOverlappingGridLines: false,
};*/

/*const options = {
  timeline: {
    groupByRowLabel: true,
  },
};*/

/*const options = {
  allowHtml: true,
};*/

const options = {};

const ExperimentThreadsLoops = ({experiments, generateChartElement }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rows, setRows] = useState(null);
  const columns = [
    { type: "string", id: "Thread" },
    { type: "string", id: "Loop" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ];

  useEffect( () => {

  }, [] );
const chartRef = useRef();
  return <>
    <Tooltip title={'Threads/Loops'}>
      <Button>
        <FontAwesomeIcon
          icon={faChartBar}
          style={{fontSize: '20px', cursor: "pointer"}}
          onClick={ ()=> {
            setIsModalVisible(true);


            // This trick with the timer is needed because, on second modal open user will see shrinked chart, can't understand why is that
            let rowsLocal: any;
            if ( !rows ) {
              rowsLocal = experiments.map( (experiment) => generateChartElement(experiment) );
              setRows(rowsLocal);
            }
            else
              rowsLocal = rows;


            setTimeout( () => {
              ReactDOM.render(
                <Chart
                  chartType="Timeline"
                  data={[columns, ...rowsLocal]}
                  style={{width: '100%', height: '800px'}}
                  options={options}
                />,
                chartRef.current);
            }, 100 );

          }}
        />
      </Button>
    </Tooltip>

    <Modal
      title={'Threads/Loops'}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width='90%'
      style={{ top: 5 }}
    >
      <div ref={chartRef}>
        <Spin/>
      </div>
    </Modal>
  </>
}

export default ExperimentThreadsLoops
