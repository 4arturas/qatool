import type { MessagesQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {Alert, Button, Modal, Pagination, Space, Table, Tag} from "antd";
import {
  dateFormatYYYYMMDDHHmmss,
  messageTypeToColor,
  messageTypeToNameShort,
  MSG_INCOMING,
  MSG_OUTGOING,
  mySubstr
} from "src/global";
import moment from "moment";
import {navigate, routes} from "@redwoodjs/router";
import jsonata from "jsonata";
import Timeline from "src/components/Timeline/Timeline";
import React, {useState} from "react";


export const QUERY = gql`
  query MessagesQuery($page: Int, $pageSize: Int) {
    messagePage(page: $page, pageSize: $pageSize) {
      messages {
        id
        type
        request
        response
        requestDate
        responseDate
        httpCode
        txnId
        jsonata
      }
      count
      page
      pageSize
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

// const columns: ColumnsType<DataType>  = [
const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (_, record: { key: React.Key }) =>
      <Tag color={messageTypeToColor(record.type)} style={{color:'black'}}>
        {messageTypeToNameShort(record.type)}
      </Tag>

  },
  {
    title: 'Request',
    dataIndex: 'request',
    key: 'request',
    render: (_, record: { key: React.Key }) =>
      <ViewJSon JSon={record.request} />
  },
  {
    title: 'Response',
    dataIndex: 'response',
    key: 'response',
    render: (_, record: { key: React.Key }) =>
      <ViewJSon JSon={record.response} />
  },
  {
    title: 'Request Date',
    dataIndex: 'requestDate',
    key: 'requestDate',
    render: (_, record: { key: React.Key }) =>
      <ViewDate date={record.requestDate} />
  },
  {
    title: 'Response Date',
    dataIndex: 'responseDate',
    key: 'responseDate',
    render: (_, record: { key: React.Key }) =>
      <ViewDate date={record.responseDate} />
  },
  {
    title: 'HTTP Code',
    dataIndex: 'httpCode',
    key: 'httpCode',
    render: (_, record: { key: React.Key }) =>
      <ViewHttpCode httpCode={record.httpCode} />
  },
  {
    title: 'txnId',
    dataIndex: 'txnId',
    key: 'txnId',
    render: (_, record: { key: React.Key }) =>
      <>{record.txnId}</>
  },
  {
    title: 'JSONata',
    dataIndex: 'jsonata',
    key: 'jsonata',
    render: (_, record: { key: React.Key }) =>
      <ShowJSONata rec={record}/>
  },
  {
    title: 'Action',
    key: 'action',
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
    <Button type="primary" onClick={()=>setIsModalVisible(true)}>
      Timeline
    </Button>
    <Modal
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width='50%'
      style={{ top: 5 }}
    >
      <Timeline outgoing={rec.type === MSG_OUTGOING?rec:null} incoming={rec.type === MSG_INCOMING?rec:null} JSONata={rec.jsonata} />
    </Modal>
  </>

}

const ShowJSONata = (({rec}) => {
  return (!rec.response||!rec.jsonata) ?
    <></> :
    jsonata(rec.jsonata).evaluate(JSON.parse(rec.response)) ?
      <Alert showIcon={true} type={"success"} message={mySubstr(rec.jsonata,5)}/> :
      <Alert showIcon={true} type={"error"} message={mySubstr(rec.jsonata,5)}/>
})

const ViewJSon = ({JSon}) => {
  return <>{JSon && mySubstr(JSon,10)}</>
}

const ViewDate = ({date}) => <>{ date && dateFormatYYYYMMDDHHmmss(date) }</>

const ViewHttpCode = ({httpCode}) => <>{ httpCode && <Tag color={httpCode===200?'green':'volcano'}>{httpCode}</Tag>} </>

export const Success = ({ messagePage }: CellSuccessProps<MessagesQuery>) => {

  return <>
    <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td>
            <Table dataSource={messagePage.messages} columns={columns} pagination={false} rowKey={'id'}/>
          </td>
        </tr>
        <tr>
          <td style={{paddingTop:'5px'}}>
            <Pagination
              defaultPageSize={messagePage.pageSize}
              defaultCurrent={messagePage.page}
              onChange={ ( page) =>
                navigate( routes.messages({page: page, pageSize: messagePage.pageSize} ) )
              }
              showSizeChanger
              onShowSizeChange={ ( current, pageSize) =>
                window.location.replace(routes.messages({page: 1, pageSize: pageSize}))
              }
              pageSizeOptions={[5,10, 20, 50, 100]}
              total={messagePage.count}
            />
          </td>
        </tr>
      </tbody>
    </table>

  </>

}
