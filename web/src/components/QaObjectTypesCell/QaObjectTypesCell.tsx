import type { QaObjectTypesQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectType from "src/components/QaObjectType/QaObjectType";


export const QUERY = gql`
  query QaObjectTypesQuery {
    qaObjectTypes {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ qaObjectTypes }: CellSuccessProps<QaObjectTypesQuery>) => {
  return (
    <ul>
      {qaObjectTypes.map((item) => (
        <QaObjectType qaObjectType={item} />
      ))}
    </ul>
  )
}
