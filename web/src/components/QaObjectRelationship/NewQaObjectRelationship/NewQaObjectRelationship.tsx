import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import QaObjectRelationshipForm from 'src/components/QaObjectRelationship/QaObjectRelationshipForm'

const CREATE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation CreateQaObjectRelationshipMutation($input: CreateQaObjectRelationshipInput!) {
    createQaObjectRelationship(input: $input) {
      id
    }
  }
`

const NewQaObjectRelationship = () => {
  const [createQaObjectRelationship, { loading, error }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
      toast.success('QaObjectRelationship created')
      navigate(routes.qaObjectRelationships())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    const castInput = Object.assign(input, { parentId: parseInt(input.parentId), childrenId: parseInt(input.childrenId), })
    createQaObjectRelationship({ variables: { input: castInput } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New QaObjectRelationship</h2>
      </header>
      <div className="rw-segment-main">
        <QaObjectRelationshipForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewQaObjectRelationship
