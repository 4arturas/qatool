import {Form, Label, Submit, SubmitHandler, TextField} from "@redwoodjs/forms";
import { useMutation } from '@redwoodjs/web'


const CREATE_QA_OBJECT_TYPE = gql`
  mutation CreateQaObjectTypeMutation($input: CreateQaObjectTypeInput!) {
    createQaObjectType(input: $input) {
      name
    }
  }
`

interface FormValues {
  name: string
}

const QaObjectTypeForm = () => {
  const [createQaObjectType, {loading,error}] = useMutation(CREATE_QA_OBJECT_TYPE);

  const onSubmit: SubmitHandler<FormValues> = (input) => {
  createQaObjectType({ variables: { input } } );
    console.log(input)
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Label name="name">Name</Label>
        <TextField name="name"  validation={{required:true}}/>
        <Submit>Submit</Submit>
      </Form>
    </div>
  )
}

export default QaObjectTypeForm
