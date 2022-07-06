import React, {useEffect, useState} from "react";
import {Button, Modal} from "antd";
import Plot from 'react-plotly.js';

const ExperimentRequestLengthBoxPlot = ({experiments}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [timeDiff, setTimeDiff] = useState(null);
  useEffect(() => {

  },[]);

  return <>
    <Button
      type="primary"
      onClick={ ()=> {
        setIsModalVisible(true)

        if ( timeDiff ) return;

        setTimeDiff(experiments.map( (e) => {
          const { requestDate, responseDate } = e;
          return new Date(responseDate).getTime() - new Date(requestDate).getTime();
        } ) );

      } }>
      Request Length Box Plot
    </Button>
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
