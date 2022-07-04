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
import {useEffect, useRef, useState} from "react";
import {prettifyJSon, validateJSONata} from "src/global";
import {Badge, Button} from "antd";
import jsonata from "jsonata";



const SuiteForm = (props) => {

  const jSonRef = useRef();

  const [valid, setValid] = useState( false );
  useEffect(() => {
    validate();
  },[])

  const validate = () =>
  {

    setValid(
      props.qaObject.qaObject?.jsonata && props.qaObject.qaObject?.json &&
      validateJSONata(props.qaObject.qaObject?.jsonata, props.qaObject.qaObject?.json)
    );
  }

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
          onChange={validate}
        />

      <Button style={{marginTop:'5px'}}
              onClick={ () => {
                jSonRef.current.value = prettifyJSon(jSonRef.current.value);
              }}>
        Prettify
      </Button>


        <FieldError name="json" className="rw-field-error" />

        <Label
          name="jsonata"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          { valid ? <Badge status={'success'} /> : <Badge status={'error'} /> } JSONata
        </Label>

        <TextField autoComplete={'off'}
          name="jsonata"
          defaultValue={props.qaObject.qaObject?.jsonata}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
          onChange={()=>validate()}

        />


        <FieldError name="jsonata" className="rw-field-error" />

    </>
  )
}

export default SuiteForm
