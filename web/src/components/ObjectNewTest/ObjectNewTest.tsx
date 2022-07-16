import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {navigate, routes} from "@redwoodjs/router";
import {
  BODY,
  CASE,
  COLLECTION,
  DEFAULT_TABLE_PAGE_SIZE, EXPERIMENT,
  getChildrenTypeIdByParentTypeId, REMOVE, REPLACE, RESPONSE, RESULT, SERVER, SUITE, TEST,
  typeIdToColor,
  typeIdToName,
  typeIdToTag,
  TYPES
} from "src/global";
import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Select} from "antd";
import {useApolloClient} from "@apollo/client";
import {Spin} from "antd/es";
import {SearchOutlined} from "@ant-design/icons";
const { TextArea } = Input;

const FIND_QA_OBJECTS_BY_TYPE = gql`
  query FindQaObjectByTypeIdQuery($typeId: Int!) {
    getQaObjectsByType: getQaObjectsByType(typeId: $typeId) {
      id typeId name description batchId threads loops
      json
      jsonata
      address
      method
      header
      createdAt
      updatedAt
    }
  }
`;

const ObjectNewTest = ({typeId, qaObject}) => {
  const client = useApolloClient();

  const [objectTypeId, setObjectTypeId] = useState( typeId );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [objectColor, setObjectColor] = useState( typeId ? typeIdToColor(typeId) : '' );

  const [server, setServer] = useState(null );
  const [collection, setCollection] = useState(null );
  const [suite, setSuite] = useState(null );
  const [cAse, setCase] = useState(null );
  const [body, setBody] = useState(null );
  const [test, setTest] = useState(null );
  const [replace, setReplace] = useState(null );
  const [remove, setRemove] = useState(null );
  const [result, setResult] = useState(null );
  const [response, setResponse] = useState(null );

  const getObjectByTypeId = async ( typeId:number, callback ) =>
  {
    const data = await client.query({
      query: FIND_QA_OBJECTS_BY_TYPE,
      variables: {typeId:typeId}
    });
    callback( data.data.getQaObjectsByType );
  }
  const fetchChildren = ( typeId:number) =>
  {
    setServer( null );
    setCollection( null );
    setSuite( null );
    setCase( null );
    setBody(null );
    setTest(null );
    setReplace(null );
    setRemove(null );
    setResult(null );
    setResponse(null );

    const children = getChildrenTypeIdByParentTypeId( typeId );
    children.map( childrenTypeId => {
      let callbackFunction;
      switch ( childrenTypeId )
      {
        case SERVER:      callbackFunction = setServer; break;
        case COLLECTION:  callbackFunction = setCollection; break;
        case SUITE:       callbackFunction = setSuite; break;
        case CASE:        callbackFunction = setCase; break;
        case BODY:        callbackFunction = setBody; break;
        case TEST:        callbackFunction = setTest; break;
        case REPLACE:     callbackFunction = setReplace; break;
        case REMOVE:      callbackFunction = setRemove; break;
        case RESULT:      callbackFunction = setResult; break;
        case RESPONSE:    callbackFunction = setResponse; break;
      }

      if ( callbackFunction )
      {
        callbackFunction( [] );
        getObjectByTypeId( childrenTypeId, callbackFunction );
      }
    } );
  }
  useEffect( () => {
    fetchChildren( typeId );
  }, [] );



  const [form] = Form.useForm();

  const stylingObject = {
    icon: { fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(typeId)}`, marginBottom: '-3px' },
    formItem: {},
    selectObjectType: {}
  }


  const SelectChildren = ( { typeId, options, multiple }) => {
    const convertToOptions = ( qaObject ) => qaObject.map( qa => { return {value: qa.id, label: qa.name } } );

    if ( !options ) return <></>

    if ( options.length === 0 ) return <div style={{float:'right'}}><Spin/></div>

    const label = typeIdToName(typeId);

    return options && <Form.Item
      label={label}
      name={`childrenId${typeId}`}
      rules={[{ required: true, message: `Please select ${label}!` }]}
    >
      {multiple ?
        <Select
          mode={'multiple'}
          placeholder={`Select ${label}`}
          options={convertToOptions(options)}
          style={{border: `1px solid ${typeIdToColor(typeId)}`}}
        /> :
        <Select
          placeholder={`Select ${label}`}
          options={convertToOptions(options)}
          style={{border: `1px solid ${typeIdToColor(typeId)}`}}
        />
      }
    </Form.Item>
  }
  return <>
    <FontAwesomeIcon
      icon={faCirclePlus}
      style={stylingObject.icon}
      onClick={ ()=>setIsModalVisible(true) }/>
      <span style={{marginLeft:'3px'}}>
        <a href={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0, typeId:`${typeId}`} )}>
          {typeIdToTag(typeId)}
        </a>
      </span>

    <Modal
      title={ 'New Object' }
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      footer={null}
      width={'100%'}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{typeId:typeId, name: 'test'}}
        onFinish={ (values: any) => {
          console.log( values );
        }}
        onFinishFailed={(errorInfo: any) => {
          console.log('Failed:', errorInfo);
        }}
        autoComplete="off"
      >

            <Form.Item
              label="Object Type"
              name="typeId"
              rules={[{ required: true, message: 'Please select object type!' }]}
              style={stylingObject.formItem}
            >
              <Select
                style={{...stylingObject.selectObjectType, border: `1px solid ${objectColor}` } }
                placeholder="Select Object Type"
                options={TYPES.map( typeId => { return { value: typeId, label: typeIdToName(typeId) } } )}
                onChange={ (typeId) =>
                {
                  setObjectTypeId(typeId);
                  setObjectColor( typeIdToColor(typeId));
                  fetchChildren( typeId );
                } }
              />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
              style={stylingObject.formItem}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              style={stylingObject.formItem}
            >
              <TextArea rows={4}/>
            </Form.Item>

            <SelectChildren typeId={SERVER} options={server} multiple={false}/>
            <SelectChildren typeId={COLLECTION} options={collection} multiple={true}/>
            <SelectChildren typeId={SUITE} options={suite} multiple={true}/>
            <SelectChildren typeId={CASE} options={cAse} multiple={true}/>
            <SelectChildren typeId={BODY} options={body} multiple={false}/>
            <SelectChildren typeId={TEST} options={test} multiple={false}/>
            <SelectChildren typeId={REPLACE} options={replace} multiple={false}/>
            <SelectChildren typeId={REMOVE} options={remove} multiple={false}/>
            <SelectChildren typeId={RESULT} options={result} multiple={false}/>
            <SelectChildren typeId={RESPONSE} options={response} multiple={false}/>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{float:'right'}}>
                Submit
              </Button>
            </Form.Item>
      </Form>
    </Modal>
  </>
}

export default ObjectNewTest
