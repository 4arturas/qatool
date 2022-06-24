import type { FindQaObjects } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { Link, routes } from '@redwoodjs/router'

import QaObjects from 'src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjects'

export const QUERY = gql`
  query FindQaObjects {
    qaObjects {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No qaObjects yet. '}
      <Link
        to={routes.newQaObject()}
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

export const Success = ({ qaObjects }: CellSuccessProps<FindQaObjects>) => {
  return <QaObjects qaObjects={qaObjects} />

}
