import type { FindUserEditQuery, FindUserEditQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import UserEdit from "src/components/UserEdit/UserEdit";

export const QUERY = gql`
  query FindUserEditQuery($id: Int!) {
    user: getUser(id: $id) {
      id
      email
      userRoles
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserEditQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ user, OnSubmitFormFunction }: CellSuccessProps<FindUserEditQuery, FindUserEditQueryVariables>) => {
  return <UserEdit user={user} OnSubmitFormFunction={OnSubmitFormFunction}/>
}
