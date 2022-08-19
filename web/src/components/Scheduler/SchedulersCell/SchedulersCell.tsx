import type { FindSchedulers } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { Link, routes } from '@redwoodjs/router'

import Schedulers from 'src/components/Scheduler/Schedulers'

export const QUERY = gql`
  query FindSchedulers {
    schedulers {
      id
      name
      executeAt
      times
      executed
      experiments { id name }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No schedulers yet. '}
      <Link
        to={routes.newScheduler()}
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

export const Success = ({ schedulers }: CellSuccessProps<FindSchedulers>) => {
  return <Schedulers schedulers={schedulers} />
}
