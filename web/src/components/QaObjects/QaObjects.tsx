import React, {useEffect, useState} from "react";
import {Pagination, Table, Tag} from "antd";
import {
  getChildrenTypeIdByParentTypeId,
  mySubstr,
  typeIdMargin, typeIdTagMargin,
  typeIdToColor,
  typeIdToName
} from "src/global";
import {navigate, routes} from "@redwoodjs/router";

import EditObject, {EDIT_OBJECT_CLONE, EDIT_OBJECT_NEW, EDIT_OBJECT_UPDATE} from "src/components/EditObject/EditObject";
import DeleteObject from "src/components/DeleteObject/DeleteObject";

const QaObjects = ({qaObjects, page, pageSize, count}) => {

  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 170,
      render: (_, record: { key: React.Key }) =>
        typeIdTagMargin(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width:300,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.description, 9)
    },
    {
      title: 'BatchId',
      dataIndex: 'batchId',
      key: 'batchId',
      width: 50
    },
    {
      title: 'Threads',
      dataIndex: 'threads',
      key: 'threads',
      width: 50
    },
    {
      title: 'Loops',
      dataIndex: 'loops',
      key: 'loops',
      width: 50
    },
    {
      title: 'Json',
      dataIndex: 'json',
      key: 'json',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.json, 10)
    },
    {
      title: 'JSONata',
      dataIndex: 'jsonata',
      key: 'jsonata',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.jsonata, 10)
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.address, 10)
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 50
    },
    {
      title: 'Header',
      dataIndex: 'header',
      key: 'header',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.header, 10)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <EditObject object={record} type={EDIT_OBJECT_UPDATE}/>&nbsp;&nbsp;&nbsp;
          <EditObject object={record} type={EDIT_OBJECT_CLONE}/>&nbsp;&nbsp;&nbsp;
          <DeleteObject id={record.id} />
        </>
      ),
    },
  ];

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    }, [] );


  return <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
    <tbody>
    <tr>
      <td>
        <div style={{marginBottom:'5px'}}><EditObject object={null} type={EDIT_OBJECT_NEW}/></div>
        <Table
          dataSource={qaObjects}
          columns={columns}
          pagination={false}
          loading={loading}
          bordered
          expandable={{
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            rowExpandable: record => (getChildrenTypeIdByParentTypeId(record.typeId).length>0),
          }}
          rowKey={'id'}/>
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
