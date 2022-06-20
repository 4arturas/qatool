import type { FindQaObjectByIdQuery, FindQaObjectByIdQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectById from "src/components/QaObjectById/QaObjectById";

export const QUERY = gql`
  query FindQaObjectByIdQuery($id: Int!) {
    qaObject: qaObject(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQaObjectByIdQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ qaObject, }: CellSuccessProps<FindQaObjectByIdQuery, FindQaObjectByIdQueryVariables>) => {
  return <QaObjectById qaObject={qaObject}/>
}
