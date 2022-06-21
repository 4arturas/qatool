import type { FindQaObjectRelationshipQueryByParentId } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectByIdCell from 'src/components/QaObjectByIdCell'
import QaObjectRelationshipsCell from '../QaObjectRelationshipsCell'
import {Link, routes} from "@redwoodjs/router";
import {getChildrenTypeIdByParentTypeId, objectTypeToName, typeIdToColor} from "src/global";

export const QUERY = gql`
  query FindQaObjectRelationshipQueryByParentId($parentId: Int!) {

    qaObject: qaObject(id: $parentId) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
      address
      method
      header
      createdAt
      updatedAt
    }

    qaObjectRelationshipsWithTheSameParentId: qaObjectRelationshipsWithTheSameParentId(parentId: $parentId) {
      id
      parentId
      childrenId
    }

  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ qaObject, qaObjectRelationshipsWithTheSameParentId }: CellSuccessProps<FindQaObjectRelationshipQueryByParentId>) => {

  return (
    <>
      <span style={{ whiteSpace: 'nowrap', width:'10px', borderRadius:'15px', border: '1px solid black', padding: '20px', marginBottom: '40px', backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>

        <strong style={{marginRight: '10px'}}>{qaObject.name}</strong>

        <Link to={routes.editQaObject({id:qaObject.id} ) } style={{marginRight: '10px'}}>
          Edit
        </Link>

        {getChildrenTypeIdByParentTypeId(qaObject.typeId).map( (tId) => (
          <Link key={tId} to={routes.qaObjectRelationshipNew({ parentId: qaObject.id, typeId: tId } ) } style={{marginRight: '10px'}}>
            Add New Children <span style={{backgroundColor: `${typeIdToColor(tId)}`, border: '1px solid black', padding: '3px', borderRadius: '15px'}}>{objectTypeToName(tId)}</span>
          </Link>
        ))}

      </span>
      <br/>
      <br/>
      <br/>


      {qaObjectRelationshipsWithTheSameParentId.map((item) =>
        <div key={item.id} style={{marginLeft:'60px'}}><QaObjectRelationshipsCell parentId={item.childrenId}/></div>
      )}

    </>

  )
}
