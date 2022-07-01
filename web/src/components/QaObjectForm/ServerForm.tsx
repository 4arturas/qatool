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
import QaObjectFindByTypeCell from 'src/components/QaObjectFindByTypeCell'
import QaObjectsFindByTypeCell from 'src/components/QaObjectsFindByTypeCell'
import {SUITE} from "src/global";



const CollectionForm = (props) => {

  return (
    <>
        <Label
          name="address"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Address
        </Label>

        <TextField
          name="address"
          defaultValue={props.qaObject.qaObject?.address}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />


        <FieldError name="address" className="rw-field-error" />

        <Label
          name="method"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Method
        </Label>

        <SelectField
          name="method"
          defaultValue={props.qaObject.qaObject?.method}
          multiple={false}
          validation={{required:true}}
        >
          <option key="0"></option>
          <option key="1" value="GET">GET</option>
          <option key="2" value="POST">POST</option>
        </SelectField>


        <FieldError name="method" className="rw-field-error" />


      <Label
        name="header"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Header
      </Label>

      <TextAreaField
        name="header"
        defaultValue={props.qaObject.qaObject?.header}
        className="rw-input"
        errorClassName="rw-input rw-input-error"
        validation={{ required: true }}
        rows={35}
      />


      <FieldError name="header" className="rw-field-error" />

    </>
  )
}

export default CollectionForm
