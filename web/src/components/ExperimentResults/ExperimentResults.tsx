import React, {useState} from "react";
import {Alert, Button, Modal, Space, Table, Tag} from "antd";
import {
  dateFormatYYYYMMDDHHmmss,
  messageTypeToColor,
  messageTypeToNameShort,
  MSG_INCOMING,
  MSG_OUTGOING,
  mySubstr
} from "src/global";
import Timeline from "src/components/Timeline/Timeline";
import jsonata from "jsonata";
import {FieldTimeOutlined} from "@ant-design/icons";
import JSONModal from "src/components/JSONModal/JSONModal";
import JSONataJsonModal from "src/components/JSONataJsonModal/JSONataJsonModal";
import TimelineCell from "src/components/TimelineCell";

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

const ExperimentResults = ( experiments ) => {

  return (
    <div>
      <Table dataSource={experiments.experiments} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
    </div>
  )
}

export default ExperimentResults
