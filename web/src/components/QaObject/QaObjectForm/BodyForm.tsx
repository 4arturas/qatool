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
          name="json"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          JSon
        </Label>

        <TextField
          name="json"
          defaultValue={props.qaObject.qaObject?.json}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="json" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
