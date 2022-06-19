import type { FindQaObjectById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import QaObject from 'src/components/QaObject/QaObject'

export const QUERY = gql`
  query FindQaObjectById($id: Int!) {
    qaObject: qaObject(id: $id) {
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

export const Empty = () => <div>QaObject not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObject }: CellSuccessProps<FindQaObjectById>) => {
  return <QaObject qaObject={qaObject} />
}
