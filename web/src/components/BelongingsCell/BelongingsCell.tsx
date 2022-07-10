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
        <span id={`edibBlock${record.id}${record.typeId}`}>
          <ObjectEdit qaObject={record} beforeSave={()=>{}} afterSave={()=>{}}/>&nbsp;&nbsp;&nbsp;
          <ObjectClone parentId={(record.typeId===COLLECTION || record.typeId===SERVER) ? null : record.id} qaObject={record} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>&nbsp;&nbsp;&nbsp;
          <ObjectDelete key={`delete${record.id}`}
                        id={record.id}
                        typeId={record.typeId}
                        beforeSave={()=>{}}
                        afterSave={(id)=> {
                          document.getElementById(`edibBlock${record.id}${record.typeId}`).style.display = 'none';
                        }
                        }/>&nbsp;&nbsp;&nbsp;
          {
            getChildrenTypeIdByParentTypeId(record.typeId).map( (typeId, i) =>
              <span key={`new${i}${record.id}${typeId}`}>
                <ObjectNew typeId={typeId} parentId={record.id} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>
              </span>
            )
          }
        </span>
      ),
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
