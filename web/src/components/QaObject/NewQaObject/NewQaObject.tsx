import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import QaObjectForm from 'src/components/QaObject/QaObjectForm'

const CREATE_QA_OBJECT_MUTATION = gql`
  mutation CreateQaObjectMutation($input: CreateQaObjectInput!) {
    createQaObject(input: $input) {
      id
    }
  }
`

const NewQaObject = () => {
  const [createQaObject, { loading, error }] = useMutation(CREATE_QA_OBJECT_MUTATION, {
    onCompleted: () => {
      toast.success('QaObject created')
      navigate(routes.qaObjects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    createQaObject({ variables: { input: castInput } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New QaObject</h2>
      </header>
      <div className="rw-segment-main">
        <QaObjectForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewQaObject
