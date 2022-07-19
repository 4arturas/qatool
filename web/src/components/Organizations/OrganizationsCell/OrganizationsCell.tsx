import type { OrganizationsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Organizations from "src/components/Organizations/Organizations/Organizations";


export const QUERY = gql`
  query OrganizationsQuery {
    organizations: getOrganizations {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ organizations }: CellSuccessProps<OrganizationsQuery>) => {
  return <Organizations organizations={organizations} />
}
