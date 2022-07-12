import type { BelongingsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import React, {useState} from "react";
import {COLLECTION, getChildrenTypeIdByParentTypeId, SERVER, typeIdToColor, typeIdToTag} from "src/global";
import {Link, routes} from "@redwoodjs/router";
import {Table} from "antd";
import BelongingsCell from "./BelongingsCell";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";


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
  const [children, setChildren] = useState([...belongings]);
  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 10,
      render: (_, record: { key: React.Key }) =>
        typeIdToTag(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record: { key: React.Key }) =>
        <Link to={routes.tree({id:record.id})}>
          {record.name}
        </Link>
    },
  ];

  const backgroundColor = children.length === 0 ? 'black' : typeIdToColor( children[0].typeId );

  return (
  <div style={{marginLeft: '20px', marginRight:'20px', textAlign: 'center'}}>
    <Table
      style={ { border: '1px solid '+backgroundColor }}
      columns={columns}
      dataSource={children}
      pagination={false}
      expandable={{
        expandedRowRender: record => <BelongingsCell parentId={record.id} />,
        rowExpandable: record => (getChildrenTypeIdByParentTypeId(record.typeId).length>0),
      }}
      rowKey={'id'}/>
  </div>
  )

}
