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

        <Label
          name="threads"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Threads
        </Label>

        <NumberField
          name="threads"
          defaultValue={props.qaObject.qaObject?.threads}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="threads" className="rw-field-error" />

        <Label
          name="loops"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Threads
        </Label>

        <NumberField
          name="loops"
          defaultValue={props.qaObject.qaObject?.loops}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="loops" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
