import React, {useEffect, useState} from "react";
import {Pagination, Table, Tag} from "antd";
import {
  dateFormatYYYYMMDDHHmmss, messageTypeToColor, messageTypeToNameShort,
  mySubstr,
  typeIdMargin,
  typeIdToColor,
  typeIdToName
} from "src/global";
import {navigate, routes} from "@redwoodjs/router";
import {CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

const columns = [
  {
    title: 'Type',
    dataIndex: 'typeId',
    key: 'typeId',
    render: (_, record: { key: React.Key }) =>
      <Tag color={typeIdToColor(record.typeId)} style={{marginLeft: `${typeIdMargin(record.typeId)}px`, color:'black'}}>
        {typeIdToName(record.typeId)}
      </Tag>
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (_, record: { key: React.Key }) =>
      mySubstr(record.description, 10)
  },
  {
    title: 'BatchId',
    dataIndex: 'batchId',
    key: 'batchId'
  },
  {
    title: 'Threads',
    dataIndex: 'threads',
    key: 'threads'
  },
  {
    title: 'Loops',
    dataIndex: 'loops',
    key: 'loops'
  },
  {
    title: 'Json',
    dataIndex: 'json',
    key: 'json',
    render: (_, record: { key: React.Key }) =>
      mySubstr(record.json, 10)
  },
  {
    title: 'JSONata',
    dataIndex: 'jsonata',
    key: 'jsonata',
    render: (_, record: { key: React.Key }) =>
      mySubstr(record.jsonata, 10)
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (_, record: { key: React.Key }) =>
      mySubstr(record.address, 10)
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method'
  },
  {
    title: 'Header',
    dataIndex: 'header',
    key: 'header',
    render: (_, record: { key: React.Key }) =>
      mySubstr(record.header, 10)
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (_, record: { key: React.Key }) =>
      dateFormatYYYYMMDDHHmmss(record.createdAt)
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (_, record: { key: React.Key }) =>
      dateFormatYYYYMMDDHHmmss(record.updatedAt)
  },
  {
    title: 'Action',
    key: 'action',
    width: 90,
    render: (_, record) => (
      <><EditOutlined/> <CopyOutlined /> <DeleteOutlined/></>
    ),
  },
];

const QaObjects = ({qaObjects, page, pageSize, count}) => {

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    }, [] );


  return <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
    <tbody>
    <tr>
      <td>
        <Table dataSource={qaObjects} columns={columns} pagination={false} loading={loading} bordered rowKey={'id'}/>
      </td>
    </tr>
    <tr>
      <td style={{paddingTop:'5px'}}>
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={page}
          onChange={ ( p) => {
            setLoading(true);
            navigate(routes.tmpQaObject({page: p, pageSize: pageSize}))
            setLoading(false);
            }
          }
          showSizeChanger
          onShowSizeChange={ ( current, ps) =>
            window.location.replace(routes.tmpQaObject({page: 1, pageSize: ps}))
          }
          pageSizeOptions={[5,10, 20, 50, 100]}
          total={count}
        />
      </td>
    </tr>
    </tbody>
  </table>
}

export default QaObjects
