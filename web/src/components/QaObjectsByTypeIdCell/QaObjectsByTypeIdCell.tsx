import type { FindQaObjectsByTypeIdQuery, FindQaObjectsByTypeIdQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObject from "src/layouts/QaObjectsLayout/pages/components/QaObject/QaObject";
import QaObjects from "src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjects";

export const QUERY = gql`
  query FindQaObjectsByTypeIdQuery($typeId: Int!) {
    qaObjectsByTypeId: qaObjectsByTypeId(typeId: $typeId) {
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
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQaObjectsByTypeIdQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  qaObjectsByTypeId,
}: CellSuccessProps<FindQaObjectsByTypeIdQuery, FindQaObjectsByTypeIdQueryVariables>) => {
  return <QaObjects qaObjects={qaObjectsByTypeId} />
}
