import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  Submit,
} from '@redwoodjs/forms'



const QaObjectRelationshipForm = (props) => {
  const onSubmit = (data) => {

  
    
    
  
    
    
  
    props.onSave(data, props?.qaObjectRelationship?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="parentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Parent id
        </Label>
        
          <NumberField
            name="parentId"
            defaultValue={props.qaObjectRelationship?.parentId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="parentId" className="rw-field-error" />

        <Label
          name="childrenId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Children id
        </Label>
        
          <NumberField
            name="childrenId"
            defaultValue={props.qaObjectRelationship?.childrenId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="childrenId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default QaObjectRelationshipForm
