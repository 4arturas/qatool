import type { FindQaObjectRelationshipQueryByParentId } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectByIdCell from 'src/components/QaObjectByIdCell'


export const QUERY = gql`
  query FindQaObjectRelationshipQueryByParentId($parentId: Int!) {
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

export const Success = ({ qaObjectRelationshipsWithTheSameParentId }: CellSuccessProps<FindQaObjectRelationshipQueryByParentId>) => {
  return (
    <>
      { (qaObjectRelationshipsWithTheSameParentId.length>0) && <QaObjectByIdCell id={qaObjectRelationshipsWithTheSameParentId[0]?.parentId}/> }

      {qaObjectRelationshipsWithTheSameParentId.map((item) =>
        <div style={{marginLeft:'20px'}}><QaObjectByIdCell id={item.childrenId}/></div>
      )}
    </>
  )
}
