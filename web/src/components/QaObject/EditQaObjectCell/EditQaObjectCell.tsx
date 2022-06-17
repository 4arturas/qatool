import type { EditQaObjectById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

import QaObjectForm from 'src/components/QaObject/QaObjectForm'

export const QUERY = gql`
  query EditQaObjectById($id: Int!) {
    qaObject: qaObject(id: $id) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
      createdAt
      updatedAt
    }
  }
`
const UPDATE_QA_OBJECT_MUTATION = gql`
  mutation UpdateQaObjectMutation($id: Int!, $input: UpdateQaObjectInput!) {
    updateQaObject(id: $id, input: $input) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObject }: CellSuccessProps<EditQaObjectById>) => {
  const [updateQaObject, { loading, error }] = useMutation(UPDATE_QA_OBJECT_MUTATION, {
    onCompleted: () => {
      toast.success('QaObject updated')
      navigate(routes.qaObjects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    const children = input.children;
    delete input.children;

    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    updateQaObject({ variables: { id, input: castInput } })

    // TODO: update children
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit QaObject {qaObject.id}</h2>
      </header>
      <div className="rw-segment-main">
        <QaObjectForm qaObject={qaObject} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
