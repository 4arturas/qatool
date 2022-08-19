import type { FindSchedulerEditQuery, FindSchedulerEditQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import SchedulerEdit from "src/components/Scheduler/SchedulerEdit/SchedulerEdit";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";

export const QUERY = gql`
  query FindSchedulerEditQuery($id: Int!) {
    schedulerEdit: schedulerEdit(id: $id) {
      id name executeAt times executed
      experiments
      experimentsAll { id name }
    }
  }
`

const UPDATE_SCHEDULER_MUTATION = gql`
  mutation UpdateSchedulerMutation2($id: Int!, $input: UpdateSchedulerInput!) {
    schedulerUpdate(id: $id, input: $input) {
      id
      name
      executeAt
      times
      executed
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ( { error }: CellFailureProps<FindSchedulerEditQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ schedulerEdit }: CellSuccessProps<FindSchedulerEditQuery, FindSchedulerEditQueryVariables>) => {
  const [updateScheduler, { loading, error }] = useMutation(UPDATE_SCHEDULER_MUTATION, {
    onCompleted: () => {
      toast.success('Scheduler updated')
      navigate(routes.schedulers())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (id, scheduler ) => {
    updateScheduler({ variables: { id, input: scheduler } })
  }
  return <SchedulerEdit scheduler={schedulerEdit} onSave={onSave} error={error} loading={loading} />
}
