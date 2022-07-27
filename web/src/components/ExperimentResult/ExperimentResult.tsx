import {Button, Modal, Space, Table, Tag} from "antd";
import {
  dateFormatYYYYMMDDHHmmss,
  messageTypeToColor,
  messageTypeToNameShort,
  mySubstr,
  typeIdToColor,
  typeIdToName
} from "src/global";
import JSONModal from "src/components/JSONModal/JSONModal";
import JSONataJsonModal from "src/components/JSONataJsonModal/JSONataJsonModal";
import {routes} from "@redwoodjs/router";
import ExperimentThreadsLoops from "src/components/ExperimentThreadsLoops/ExperimentThreadsLoops";
import ExperimentRequestLengthBoxPlot
  from "src/components/ExperimentRequestLengthBoxPlot/ExperimentRequestLengthBoxPlot";
import React, {useState} from "react";
import {FieldTimeOutlined} from "@ant-design/icons";
import TimelineCell from "src/components/TimelineCell";

const ShowTimeline = ({rec}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return <>
    <Button onClick={()=>setIsModalVisible(true)} icon={<FieldTimeOutlined style={{fontSize: '20px'}}/>}/>
    <Modal
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width='50%'
      style={{ top: 5 }}
    >
      <TimelineCell id={rec.id} />
    </Modal>
  </>

}

const ViewJSon = ({JSon}) => {
  return <>{JSon && mySubstr(JSon,10)}</>
}

const ViewDate = ({date}) => <>{ date && dateFormatYYYYMMDDHHmmss(date) }</>

const ViewHttpCode = ({httpCode}) => <>{ httpCode && <Tag color={httpCode===200?'green':'volcano'}>{httpCode}</Tag>} </>

const ExperimentResult = ( { experiment } ) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, record) =>
        <Tag color={messageTypeToColor(record.type)} style={{color:'black'}}>
          {messageTypeToNameShort(record.type)}
        </Tag>

    },
    {
      title: 'Request',
      dataIndex: 'request',
      key: 'request',
      render: (_, record) =>
        <>
          <ViewJSon JSon={record.request}/>&nbsp;&nbsp;&nbsp;
          <JSONModal title='Request JSON' json={record.request} />
        </>
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      render: (_, record) =>
        <>
          <ViewJSon JSon={record.response}/>&nbsp;&nbsp;&nbsp;
          <JSONModal title='Response JSON' json={record.response} />
        </>
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (_, record) =>
        <ViewDate date={record.requestDate} />
    },
    {
      title: 'Response Date',
      dataIndex: 'responseDate',
      key: 'responseDate',
      render: (_, record) =>
        <ViewDate date={record.responseDate} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        <ViewHttpCode httpCode={record.status} />
    },
    {
      title: 'Status Text',
      dataIndex: 'statusText',
      key: 'statusText'
    },
    {
      title: 'txnId',
      dataIndex: 'txnId',
      key: 'txnId',
      render: (_, record) =>
        <>{record.txnId}</>
    },
    {
      title: 'JSONata',
      dataIndex: 'jsonata',
      key: 'jsonata',
      render: (_, record) =>
        <JSONataJsonModal title='Check Response with JSONata' JSONata={record.jsonata} json={record.response} />
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_, record) => (
        <Space size="middle">
          <ShowTimeline rec={record} />
        </Space>
      ),
    },
  ];

  const timeDiff = experiment.experimentResults.map( e => {
    const { responseDate, requestDate} = e;
    return new Date(responseDate).getTime() - new Date(requestDate).getTime()
  });


  const CompMinMaxAvg = ( { arr } ) => {
    function calculateMedian( array:Array<number> ):number {
      array.sort(function(a, b) {
        return a - b;
      });
      const mid = array.length / 2;
      return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    }
    const minMaxAvg = ( arr:Array<number> ): { min:number, max:number, avg:number } =>
    {
      let min = arr[0], max = arr[0], avg: number;
      let sum:number = 0;
      arr.forEach( n => {
        min = Math.min( min, n );
        max = Math.max( max, n );
        sum += n;
      });
      avg = sum/arr.length;
      return { min, max, avg };
    }
    const median: number = calculateMedian( arr );
    const { min, max, avg } = minMaxAvg( arr );
    return <><b>Min:</b> {min} <b>Max:</b> {max} <b>Avg:</b> {avg} <b>Median:</b> {median}</>
  }


  return <>
    <div style={{marginBottom: '20px'}}>
      &nbsp;<b>Statistics for object <Tag color={typeIdToColor(experiment.experimentOwner.typeId)}>{typeIdToName(experiment.experimentOwner.typeId)}</Tag>- <a href={routes.tree({id:experiment.experimentOwner.id})}>{experiment.experimentOwner.name}</a>:</b>&nbsp;&nbsp;&nbsp;
      <ExperimentThreadsLoops
        experiments={experiment.experimentResults}
        generateChartElement={
          (experiment) => {
            const {thread, loop, requestDate, responseDate, collectionId, suiteId, caseId, testId} = experiment;
            return [`User(${collectionId}${suiteId}${caseId}${testId}): ${String(thread + 1)}`, String(`Request: ${loop + 1}`), new Date(requestDate), new Date(responseDate)]
          }
        }
      />
      &nbsp;
      <ExperimentRequestLengthBoxPlot experiments={experiment.experimentResults}/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<CompMinMaxAvg arr={timeDiff} />
    </div>

    <Table dataSource={experiment.experimentResults} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
  </>
}

export default ExperimentResult
