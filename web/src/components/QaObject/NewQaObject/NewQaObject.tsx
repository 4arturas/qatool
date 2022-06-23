import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import QaObjectForm from 'src/components/QaObject/QaObjectForm'
import {
  BODY,
  getChildrenFromInput,
  getChildrenTypeIdByParentTypeId,
  REMOVE,
  REPLACE,
  RESPONSE,
  RESULT,
  TEST
} from "src/global";

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

const NewQaObject = ({typeId, parentId}) => {

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
    const typeId: number = parseInt(input.typeId);
    const children: Array<number> = getChildrenFromInput(input);

    input.json = input.json ? JSON.stringify(JSON.parse(input.json)) : input.json;

    const castInput = Object.assign(input, { typeId: typeId, batchId: parseInt(input.batchId), })
    const data = createQaObject({ variables: { input: castInput } });
    data.then( (ret) => {
      const createQaObject = ret.data.createQaObject;
      const childParentId: number = createQaObject.id;

      children.map( async (childrenId) => {
        const castInput = { parentId: childParentId, childrenId: childrenId };
        const ret = await createQaObjectRelationship({ variables: { input: castInput } });
        const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
      });

      if ( parentId )
      {
        const castInput = { parentId: parentId, childrenId: childParentId };
        const ret = /*await*/ createQaObjectRelationship({ variables: { input: castInput } });
        // const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
      }

      toast.success('QaObject created')
      navigate(routes.qaObjects())
    });
  }

  return <QaObjectForm onSave={onSave} loading={loading} error={error} typeId={typeId}/>
}

export default NewQaObject
