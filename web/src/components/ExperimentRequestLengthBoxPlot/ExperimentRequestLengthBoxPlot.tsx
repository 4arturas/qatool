import React, {useEffect, useState} from "react";
import {Button, Modal, Tooltip} from "antd";
import Plot from 'react-plotly.js';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartColumn} from "@fortawesome/free-solid-svg-icons";

const ExperimentRequestLengthBoxPlot = ({experiments}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [timeDiff, setTimeDiff] = useState(null);
  useEffect(() => {

  },[]);

  return <>
    <Tooltip title={'Request Length Box Plot'}>
      <Button>
        <FontAwesomeIcon
            icon={faChartColumn}
            style={{fontSize: '20px', cursor: "pointer"}}
            onClick={ ()=> {
              setIsModalVisible(true)

              if ( timeDiff ) return;

              setTimeDiff(experiments.map( (e) => {
                const { requestDate, responseDate } = e;
                return new Date(responseDate).getTime() - new Date(requestDate).getTime();
              } ) );

            } }/>
      </Button>
    </Tooltip>
    <Modal
      title={'Request Length Box Plot'}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width={'100%'}
    >
      <div style={{textAlign: 'center'}}>
        <Plot style={{}}
              data={[
                {
                  x: timeDiff,
                  boxpoints: 'all',
                  jitter: 0.3,
                  pointpos: -1.8,
                  type: 'box'
                },
              ]}
          // layout={ {width: 500, height: 240, title: 'Some title'} }
              config={{displayModeBar: false}}
        />
      </div>
    </Modal>
  </>
}

export default ExperimentRequestLengthBoxPlot
