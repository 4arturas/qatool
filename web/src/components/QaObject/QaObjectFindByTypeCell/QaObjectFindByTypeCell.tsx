import type { FindQaObjectById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindQaObjectByName($name: Int!) {
    qaObject: qaObject(id: $name) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
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
  return <>{qaObject.name}</>
}
