import type { FindQaObjectRelationshipById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import QaObjectRelationship from 'src/components/QaObjectRelationship/QaObjectRelationship'

export const QUERY = gql`
  query FindQaObjectRelationshipById($id: Int!) {
    qaObjectRelationship: qaObjectRelationship(id: $id) {
      id
      parentId
      childrenId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>QaObjectRelationship not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObjectRelationship }: CellSuccessProps<FindQaObjectRelationshipById>) => {
  return <QaObjectRelationship qaObjectRelationship={qaObjectRelationship} />
}
