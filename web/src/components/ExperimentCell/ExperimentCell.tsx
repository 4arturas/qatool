import type { FindExperimentQuery, FindExperimentQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {Button, Modal, Space, Table, Tag} from "antd";
import React, {useState} from "react";
import {dateFormatYYYYMMDDHHmmss, messageTypeToColor, messageTypeToNameShort, mySubstr, typeIdToTag} from "src/global";
import JSONModal from "src/components/JSONModal/JSONModal";
import JSONataJsonModal from "src/components/JSONataJsonModal/JSONataJsonModal";
import {FieldTimeOutlined} from "@ant-design/icons";
import TimelineCell from "src/components/TimelineCell";
import ExperimentRequestLengthBoxPlot
  from "src/components/ExperimentRequestLengthBoxPlot/ExperimentRequestLengthBoxPlot";
import ExperimentThreadsLoops from "src/components/ExperimentThreadsLoops/ExperimentThreadsLoops";

export const QUERY = gql`
  query FetchExperimentResults($experimentId: Int!) {
    experiment: experimentResultsByExperimentId(experimentId: $experimentId) {
      id
      type
      experimentId
      collectionId
      suiteId
      caseId
      thread
      loop
      request
      response
      requestDate
      responseDate
      status
      statusText
      txnId
      jsonata
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ( { error }: CellFailureProps<FindExperimentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

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

const Experiment = ( { experiment } ) =>
{
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

  const timeDiff = experiment.map( e => {
    const { responseDate, requestDate} = e;
    return new Date(responseDate).getTime() - new Date(requestDate).getTime()
  });

  const funGroupExperiment = ( experiment ) => {
    const generateGroupKey = ( e ) => `${e.experimentId}${e.collectionId}${e.suiteId}${e.caseId}`;
    let groupedExperiments = {};
    experiment.forEach( exp  =>
    {
      const groupByCurrent = generateGroupKey( exp );
      if (!groupedExperiments[groupByCurrent])
        groupedExperiments[groupByCurrent] = [];
      groupedExperiments[groupByCurrent].push(exp);
    } );
    return groupedExperiments;
  }
  const groupedExperiment = funGroupExperiment( experiment );

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
      &nbsp;<b>All experiment statistics:</b>&nbsp;
      <ExperimentThreadsLoops
        experiments={experiment}
        generateChartElement={
          (experiment) => {
            const {thread, loop, requestDate, responseDate, collectionId, suiteId, caseId} = experiment;
            return [`User(${collectionId}${suiteId}${caseId}): ${String(thread + 1)}`, String(`Request: ${loop + 1}`), new Date(requestDate), new Date(responseDate)]
          }
        }
      />
      &nbsp;
      <ExperimentRequestLengthBoxPlot experiments={experiment}/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<CompMinMaxAvg arr={timeDiff} />
    </div>
    { Object.keys(groupedExperiment).map( (group) => {

      const timeDiffGroup = groupedExperiment[group].map( e => {
        const { responseDate, requestDate} = e;
        return new Date(responseDate).getTime() - new Date(requestDate).getTime()
      });

      return <div key={group}>
        <Tag color={'red'}>Experiment Group - <b>{group}</b></Tag>

        <ExperimentThreadsLoops
          experiments={groupedExperiment[group]}
          generateChartElement={
            (experiment) =>
            {
              const {thread, loop, requestDate, responseDate} = experiment;
              return [`User: ${String(thread + 1)}`, String(`Request: ${loop + 1}`), new Date(requestDate), new Date(responseDate)]
            }
          }
        />
        &nbsp;
        <ExperimentRequestLengthBoxPlot
          experiments={groupedExperiment[group]}/>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<CompMinMaxAvg arr={timeDiffGroup} />


        <Table dataSource={groupedExperiment[group]} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
      </div>
    } )}
  </>
}

export const Success = ({ experiment }: CellSuccessProps<FindExperimentQuery, FindExperimentQueryVariables>) => {
  return <Experiment experiment={experiment} />
}
