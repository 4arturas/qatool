import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  CheckboxField,
  Submit, SelectField, useForm, TextAreaField,
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

        <TextAreaField
          name="json"
          defaultValue={props.qaObject.qaObject?.json}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
          rows={15}
        />


        <FieldError name="json" className="rw-field-error" />

        <Label
          name="jsonata"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          JsoNata
        </Label>

        <TextField
          name="jsonata"
          defaultValue={props.qaObject.qaObject?.jsonata}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="jsonata" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
