import type { MessagesQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {Pagination, Table, Tag} from "antd";
import {messageTypeToColor, messageTypeToNameShort, TABLE_PAGE_SIZE} from "src/global";
import moment from "moment";
import {navigate, routes} from "@redwoodjs/router";


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
];

const ViewJSon = ({JSon}) => {
  return <>{JSon && JSon.substring(0, 10) + ' ... ' + JSon.substring(JSon.length-10, JSon.length)}</>
}

const ViewDate = ({date}) => <>{ date && moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss') }</>

const ViewHttpCode = ({httpCode}) => <>{ httpCode && <Tag color={httpCode===200?'green':'volcano'}>{httpCode}</Tag>} </>

export const Success = ({ messagePage }: CellSuccessProps<MessagesQuery>) => {

  return <>

  <div>Count: {messagePage.count}</div>
  <div>page: {messagePage.page}</div>
  <div>pageSize: {messagePage.pageSize}</div>
    <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td>
            <Table dataSource={messagePage.messages} columns={columns} pagination={false}/>
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
