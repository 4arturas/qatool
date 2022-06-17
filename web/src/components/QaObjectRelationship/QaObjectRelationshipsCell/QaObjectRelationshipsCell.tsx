import type { FindQaObjectRelationships } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { Link, routes } from '@redwoodjs/router'

import QaObjectRelationships from 'src/components/QaObjectRelationship/QaObjectRelationships'

export const QUERY = gql`
  query FindQaObjectRelationships {
    qaObjectRelationships {
      id
      parentId
      childrenId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No qaObjectRelationships yet. '}
      <Link
        to={routes.newQaObjectRelationship()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObjectRelationships }: CellSuccessProps<FindQaObjectRelationships>) => {
  return <QaObjectRelationships qaObjectRelationships={qaObjectRelationships} />
}
