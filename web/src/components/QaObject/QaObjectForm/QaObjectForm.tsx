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
import {useEffect, useState} from "react";
import CollectionForm from "./CollectionForm";
import SuiteForm from "src/components/QaObject/QaObjectForm/SuiteForm";
import {COLLECTION, parentHasChildrenOfTypeId, SUITE} from "src/global";
import QaObjectsFindByTypeCell from "src/components/QaObject/QaObjectsFindByTypeCell";



const QaObjectForm = (props) => {
  const formMethods = useForm()
  const [typeId,setTypeId] = useState(props?.qaObject?.typeId);
  const onSubmit = (data) => {
    props.onSave(data, props?.qaObject?.id)
  }



  const onSelect = (data) => {
    setTypeId(parseInt(data.target.value));
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error} formMethods={formMethods}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="typeId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Object type
        </Label>

        {/*          <NumberField
            name="typeId"
            defaultValue={props.qaObject?.typeId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />*/}

        <SelectField
          name="typeId"
          disabled={!!typeId}
          defaultValue={props.qaObject?.typeId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          onChange={onSelect}
          validation={{
            required: true,
            validate: {
              matchesInitialValue: (value) => {
                return (
                  value !== 'Please select an option' ||
                  'Select an Option'
                )
              },
            },
          }}
        >
          <option value={0}>Please select object type</option>
          <option value={1}>Collection</option>
          <option value={2}>Server</option>
          <option value={3}>Suite</option>
          <option value={4}>Case</option>
          <option value={5}>Body</option>
          <option value={6}>Test</option>
          <option value={7}>Replace</option>
          <option value={8}>Remove</option>
          <option value={9}>Result</option>
          <option value={10}>Response</option>
        </SelectField>


        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.qaObject?.name}
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
          defaultValue={props.qaObject?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        {typeId===COLLECTION?<CollectionForm qaObject={props}/>:<></>}
        {typeId===SUITE?<SuiteForm qaObject={props}/>:<></>}

        { typeId ?
          <>
            <Label
              name="children"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Children
            </Label>
            <br/>
            <QaObjectsFindByTypeCell parentId={props.qaObject?.id} typeId={ parentHasChildrenOfTypeId(typeId) } multiple={true}/>
          </>
          : <></>
        }

        { typeId ?
          <div className="rw-button-group">
            <Submit
              disabled={props.loading}
              className="rw-button rw-button-blue"
            >
              Save
            </Submit>
          </div>:<></>}

      </Form>
    </div>
  )
}

export default QaObjectForm
