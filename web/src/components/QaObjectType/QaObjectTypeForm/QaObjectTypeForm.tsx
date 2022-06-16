import {Form, FormError, Label, Submit, SubmitHandler, TextField, useForm} from "@redwoodjs/forms";
import { useMutation } from '@redwoodjs/web'
import {toast, Toaster} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";


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

  const formMethods = useForm();

  const [createQaObjectType, {loading,error}] = useMutation(
    CREATE_QA_OBJECT_TYPE,
    {
      onCompleted: () => {
        toast.success("Item created");
        navigate(routes.objectTypes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  );

  const onSubmit: SubmitHandler<FormValues> = (input) => {
    createQaObjectType({ variables: { input } } );
  }

  return (
    <div>
      <Toaster />
      <Form
        onSubmit={onSubmit}
        config={{ mode: 'onBlur' }}
        error={error}
        formMethods={formMethods}
      >
        <FormError error={error} wrapperClassName="form-error" />
        <Label name="name">Name</Label>
        <TextField name="name"  validation={{required:true}}/>
        <Submit disabled={loading}>Submit</Submit>
      </Form>
    </div>
  )
}

export default QaObjectTypeForm
