import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  CheckboxField,
  Submit, SelectField, useForm,
} from '@redwoodjs/forms'
import {useEffect} from "react";



const SuiteForm = (props) => {

  return (
    <>
        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.qaObject.qaObject?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="name" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.qaObject.qaObject?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="description" className="rw-field-error" />

        <Label
          name="batchId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Batch id
        </Label>

        <NumberField
          name="batchId"
          defaultValue={props.qaObject.qaObject?.batchId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="batchId" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
