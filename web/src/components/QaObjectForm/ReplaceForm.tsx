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
import {useEffect, useRef} from "react";
import {Button} from "antd";
import {prettifyJSon} from "src/global";



const SuiteForm = (props) => {

  const jSonRef = useRef();

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
          ref={jSonRef}
        />

      <Button style={{marginTop:'5px'}}
              onClick={ () => {
                jSonRef.current.value = prettifyJSon(jSonRef.current.value);
              }}>
        Prettify
      </Button>

        <FieldError name="json" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
