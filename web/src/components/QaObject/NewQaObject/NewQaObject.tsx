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
const CREATE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation CreateQaObjectRelationshipMutation($input: CreateQaObjectRelationshipInput!) {
    createQaObjectRelationship(input: $input) {
      id
    }
  }
`

const NewQaObject = () => {

  const [createQaObject, { loading, error }] = useMutation(CREATE_QA_OBJECT_MUTATION, {
    onCompleted: () => {

    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    const children = input.children;
    delete input.children;

    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    const data = createQaObject({ variables: { input: castInput } });
    data.then( (ret) => {
      const createQaObject = ret.data.createQaObject;
      const parentId: number = createQaObject.id;

      children.map( async (childrenId) => {
        const castInput = { parentId: parentId, childrenId: parseInt(childrenId) };
        const ret = await createQaObjectRelationship({ variables: { input: castInput } });
        const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
      });

      toast.success('QaObject created')
      navigate(routes.qaObjects())
    });
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
