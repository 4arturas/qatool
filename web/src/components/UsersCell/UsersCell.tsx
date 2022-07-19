import type { UsersQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Users from "src/components/Users/Users";


export const QUERY = gql`
  query UsersQuery {
    users: getUsers {
      id
      email
      deleted
      userRoles {
        name
      }
      orgId
      organization {
        id
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ users }: CellSuccessProps<UsersQuery>) => {
  return <Users users={users} />
}
