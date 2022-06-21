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
import {
  BODY,
  CASE,
  COLLECTION,
  getChildrenTypeIdByParentTypeId, typeIdToName,
  REMOVE,
  REPLACE, RESPONSE,
  RESULT, SERVER,
  SUITE,
  TEST
} from "src/global";
import QaObjectsFindByTypeCell from "src/components/QaObject/QaObjectsFindByTypeCell";
import CaseForm from "src/components/QaObject/QaObjectForm/CaseForm";
import BodyForm from "src/components/QaObject/QaObjectForm/BodyForm";
import ReplaceForm from "src/components/QaObject/QaObjectForm/ReplaceForm";
import ResultForm from "src/components/QaObject/QaObjectForm/ResultForm";
import ServerForm from "src/components/QaObject/QaObjectForm/ServerForm";



const QaObjectForm = (props) => {

  const formMethods = useForm()

  const [typeId,setTypeId] = useState(props?.qaObject?.typeId || (props.typeId&&parseInt(props.typeId)));
  const onSubmit = (data) => {
    props.onSave(data, props?.qaObject?.id)
  }

  const onSelect = (data) => {
    setTypeId(parseInt(data.target.value));
  }

  const renderOption = (typeId1, typeId2) => {
    const render: boolean = !typeId1 || typeId1 === typeId2;
    if (render)
      return <option value={typeId2}>{typeIdToName(typeId2)}</option>;
    return <></>
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
          defaultValue={typeId}
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
          { !typeId && <option value={0}>Please select object type</option> }
          { renderOption(typeId,COLLECTION) }
          { renderOption(typeId,SERVER) }
          { renderOption(typeId,SUITE) }
          { renderOption(typeId,CASE) }
          { renderOption(typeId,BODY) }
          { renderOption(typeId,TEST) }
          { renderOption(typeId,REPLACE) }
          { renderOption(typeId,REMOVE) }
          { renderOption(typeId,RESULT) }
          { renderOption(typeId,RESPONSE) }
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
          validation={{ required: false }}
        />

        <FieldError name="description" className="rw-field-error" />

        {typeId===COLLECTION?<CollectionForm qaObject={props}/>:<></>}
        {typeId===SERVER?<ServerForm qaObject={props}/>:<></>}
        {typeId===SUITE?<SuiteForm qaObject={props}/>:<></>}
        {typeId===CASE?<CaseForm qaObject={props}/>:<></>}
        {typeId===BODY?<BodyForm qaObject={props}/>:<></>}
        {typeId===REPLACE?<ReplaceForm qaObject={props}/>:<></>}
        {typeId===REMOVE?<ReplaceForm qaObject={props}/>:<></>}
        {typeId===RESULT?<ResultForm qaObject={props}/>:<></>}
        {typeId===RESPONSE?<ReplaceForm qaObject={props}/>:<></>}

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
            {(() => {
              const childrenTypeIdArray: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
              switch(typeId) {
                case CASE:
                  const ARRAY_ID_BODY:number = 0;
                  const ARRAY_ID_TEST:number = 1;
                  return (
                    <table>
                      <thead>
                        <tr>
                          <th>Body</th>
                          <th>Test</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${BODY}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_BODY] } multiple={false}/></td>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${TEST}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_TEST] } multiple={true}/></td>
                        </tr>
                      </tbody>
                    </table>
                  )
                case TEST:
                  const ARRAY_ID_REPLACE:number = 0;
                  const ARRAY_ID_REMOVE:number = 1;
                  const ARRAY_ID_RESULT:number = 2;
                  const ARRAY_ID_RESPONSE:number = 3;
                  return (
                    <table>
                      <thead>
                        <tr>
                          <th>Replace</th>
                          <th>Remove</th>
                          <th>Result</th>
                          <th>Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${REPLACE}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_REPLACE] } multiple={false}/></td>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${REMOVE}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_REMOVE] } multiple={false}/></td>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${RESULT}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_RESULT] } multiple={false}/></td>
                          <td style={{verticalAlign:'top'}}><QaObjectsFindByTypeCell name={`children${RESPONSE}`} parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[ARRAY_ID_RESPONSE] } multiple={false}/></td>
                        </tr>
                      </tbody>
                    </table>
                  )
                case SERVER:
                case BODY:
                case REPLACE:
                case REMOVE:
                case RESULT:
                case RESPONSE:
                  return <div>This object type can not have children</div>
                default:
                  return <QaObjectsFindByTypeCell name="children" parentId={props.qaObject?.id} typeId={ childrenTypeIdArray[0] } multiple={true}/>
              }
            })()}

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
