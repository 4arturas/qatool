import type { FindQaObjectRelationshipQueryByParentId } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectByIdCell from 'src/components/QaObjectByIdCell'
import QaObjectRelationshipsCell from '../QaObjectRelationshipsCell'
import {Link, routes} from "@redwoodjs/router";
import {getChildrenTypeIdByParentTypeId} from "src/global";

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
      <div style={{marginBottom: '10px'}}>
        {qaObject.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={routes.qaObjectRelationshipNew({ parentId: qaObject.id, typeId: getChildrenTypeIdByParentTypeId(qaObject.typeId) } ) }>
          Add Child
        </Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={routes.editQaObject({id:qaObject.id} ) }>
          Edit
        </Link>
      </div>
      {qaObjectRelationshipsWithTheSameParentId.map((item) =>
        <div key={item.id} style={{marginLeft:'20px'}}><QaObjectRelationshipsCell parentId={item.childrenId}/></div>
      )}
    </>
  )
}
