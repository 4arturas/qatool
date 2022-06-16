import type { FindQaObjectTypeQuery, FindQaObjectTypeQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectType from "src/components/QaObjectType/QaObjectType/QaObjectType";

export const QUERY = gql`
  query FindQaObjectTypeQuery($id: Int!) {
    qaObjectType: qaObjectType(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQaObjectTypeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  qaObjectType,
}: CellSuccessProps<FindQaObjectTypeQuery, FindQaObjectTypeQueryVariables>) => {
  return <><QaObjectType qaObjectType={qaObjectType} /></>
}
