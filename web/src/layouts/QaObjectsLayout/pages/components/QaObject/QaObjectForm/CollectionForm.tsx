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
import QaObjectFindByTypeCell from 'src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectFindByTypeCell'
import QaObjectsFindByTypeCell from 'src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectsFindByTypeCell'
import {SUITE} from "src/global";



const CollectionForm = (props) => {

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

    </>
  )
}

export default CollectionForm
