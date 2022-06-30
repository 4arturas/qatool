import type { BelongingsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import React from "react";
import {getChildrenTypeIdByParentTypeId, typeIdToColor, typeIdToTag} from "src/global";
import {Link, routes} from "@redwoodjs/router";
import {Table} from "antd";
import BelongingsCell from "./BelongingsCell";
import EditObject, {EDIT_OBJECT_CLONE, EDIT_OBJECT_NEW, EDIT_OBJECT_UPDATE} from "src/components/EditObject/EditObject";
import DeleteObject from "src/components/DeleteObject/DeleteObject";


export const QUERY = gql`
  query BelongingsQuery($parentId: Int) {
    belongings(parentId: $parentId) {
      id
      typeId
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ belongings }: CellSuccessProps<BelongingsQuery>) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
      render: (_, record: { key: React.Key }) =>
        typeIdToTag(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width:200,
      render: (_, record: { key: React.Key }) =>
        <Link to={routes.qaObjectRelationship({id:record.id})}>
          {record.name}
        </Link>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <EditObject key={`update${record.id}`} object={record} type={EDIT_OBJECT_UPDATE}/>&nbsp;&nbsp;&nbsp;
          <EditObject key={`clone${record.id}`} object={record} type={EDIT_OBJECT_CLONE}/>&nbsp;&nbsp;&nbsp;
          <DeleteObject key={`delete${record.id}`} id={record.id} />&nbsp;&nbsp;&nbsp;
          {
            getChildrenTypeIdByParentTypeId(record.typeId).map( (typeId, i) =>
              <span key={`new${i}${record.id}${typeId}`}>
                <EditObject object={{ id:record.id, typeId: typeId }} type={EDIT_OBJECT_NEW}/> {typeIdToTag(typeId)}
              </span>
            )
          }
        </>
      ),
    }
  ];

  const backgroundColor = belongings.length === 0 ? 'black' : typeIdToColor( belongings[0].typeId );

  return (
  <div style={{marginLeft: '20px', width:'90%', textAlign: 'center'}}>
    <Table
      style={ { border: '1px solid '+backgroundColor }}
      columns={columns}
      dataSource={belongings}
      pagination={false}
      expandable={{
        expandedRowRender: record => <BelongingsCell parentId={record.id} />,
        rowExpandable: record => (getChildrenTypeIdByParentTypeId(record.typeId).length>0),
      }}
      rowKey={'id'}/>
  </div>
  )

}
