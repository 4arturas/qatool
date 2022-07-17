import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPen} from "@fortawesome/free-solid-svg-icons";
import {navigate, routes} from "@redwoodjs/router";
import {
  BODY,
  CASE,
  COLLECTION, CREATE_QA_OBJECT_RELATIONSHIP_MUTATION,
  DEFAULT_TABLE_PAGE_SIZE, EXPERIMENT,
  getChildrenTypeIdByParentTypeId, REMOVE, REPLACE, RESPONSE, RESULT, SERVER, SUITE, TEST,
  typeIdToColor,
  typeIdToName,
  typeIdToTag,
  TYPES
} from "src/global";
import React, {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Modal, Select, Tag} from "antd";
import {useApolloClient} from "@apollo/client";
import {Spin} from "antd/es";
import {toast} from "@redwoodjs/web/toast";
import {useMutation} from "@redwoodjs/web";
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

const CREATE_QA_OBJECT_MUTATION = gql`
  mutation CreateQaObjectMutationNewQaObject($input: CreateQaObjectInput!) {
    createQaObject(input: $input) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
      address
      method
      header
      createdAt
      updatedAt
    }
  }`;

const SPLIT_SYMBOL = '-';
const ObjectNewTest = ({typeId, qaObject, children, beforeSave, afterSave }) => {
  const client = useApolloClient();

  const [componentQaObject, setComponentQaObject] = useState( qaObject );
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

  const [createQaObject, {loading: loadingSaveNew, error: errorSavingNew, data: newObject}] = useMutation( CREATE_QA_OBJECT_MUTATION,
    {
      onCompleted: () => {
        // console.log( newObject );
        // afterSaved(newObject);
      },
      onError: (error) => {
        toast.error(error.message)
      },
    });

  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {

    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

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

    if ( componentQaObject )
    {
      const newQaObject = { ...qaObject };
      // newQaObject['childrenId3'] = [{ value: "19-3", label: "S" }];
      // newQaObject['childrenId2'] = [{ value: "20-2", label: "C" }];
      children.map( (qaObjectChildren) => {
        const memberName = `childrenId${qaObjectChildren.typeId}`
        if ( !newQaObject[memberName] )
          newQaObject[memberName] = [];
        newQaObject[memberName].push( convertQaObjectToOption(qaObjectChildren));
      });
      setComponentQaObject( newQaObject );
    }

  }, [] );



  const [form] = Form.useForm();

  const stylingObject = {
    icon: { fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(typeId)}`, marginBottom: '-3px' },
    formItem: {},
    selectObjectType: {}
  }

  const convertQaObjectToOption = ( qaObject ) => ( { value: `${qaObject.id}${SPLIT_SYMBOL}${qaObject.typeId}`, label: qaObject.name } );

  const SelectChildren = ( { typeId, options, multiple, children }) => {

    const convertToOptions = ( qaObject ) => qaObject.map( qa => convertQaObjectToOption( qa ) );

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
      icon={componentQaObject ? faPen : faCirclePlus}
      style={stylingObject.icon}
      onClick={ ()=>setIsModalVisible(true) }/>

    { !componentQaObject &&
      <span style={{marginLeft:'3px'}}>
        <a href={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0, typeId:`${typeId}`} )}>
          {typeIdToTag(typeId)}
        </a>
      </span>
    }

    <Modal
      title={ <Tag color={typeIdToColor(objectTypeId)} style={{color:'black'}}>New {typeIdToName(objectTypeId)}</Tag> }
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      destroyOnClose={true}
      footer={null}
      width={'100%'}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={componentQaObject}
        onFinish={ (values: any) => {
          beforeSave();
          const children = [];
          Object.keys( values ).map( k => {
            if ( k.indexOf('childrenId') !== -1 )
            {
              const childrenId = values[k];
              const splitC = ( val ) => { const s = val.split(SPLIT_SYMBOL); return { childrenId: s[0], childrenObjectTypeId: s[1] } }
              if ( Array.isArray(childrenId) )
              {
                childrenId.map( c => children.push( splitC( c ) ) );
              }
              else
              {
                children.push( splitC( childrenId ) );
              }
              delete values[k];
            }
          });
          // values.children = children;

          const data = createQaObject({ variables: { input: values } });

          data.then( (ret) => {
            const newCreateQaObject = ret.data.createQaObject;
            const childParentId: number = newCreateQaObject.id;

            children.map(async (c) => {
              const castInput = {parentId: childParentId, childrenId: (c.childrenId * 1), childrenObjectTypeId: (c.childrenObjectTypeId*1) };
              const ret = await createQaObjectRelationship({variables: {input: castInput}});
            });

            /*            if ( parentId )
                        {
                          const castInput = { parentId: parentId, childrenId: childParentId };
                          const ret = /!*await*!/ createQaObjectRelationship({ variables: { input: castInput } });
                          // const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
                        }*/

            toast.success('New Object created')
            setIsModalVisible(false);

            afterSave(newCreateQaObject);

          })
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

            { ( objectTypeId===COLLECTION || objectTypeId===SUITE || objectTypeId===CASE ) &&

              <Form.Item
                label="Batch ID"
                name="batchId"
                style={stylingObject.formItem}
              >
                <InputNumber/>
              </Form.Item>
            }

            { objectTypeId===CASE &&
              <>
                <Form.Item
                  label="Number of Users"
                  name="threads"
                  rules={[{ required: true, message: 'Please input number of Users!' }]}
                  style={stylingObject.formItem}
                >
                  <InputNumber/>
                </Form.Item>
                <Form.Item
                  label="Number of Requests per User"
                  name="loops"
                  rules={[{ required: true, message: 'Please input number number of Requests per User!' }]}
                  style={stylingObject.formItem}
                >
                  <InputNumber/>
                </Form.Item>
              </>
            }

            { objectTypeId===SERVER &&
              <>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: 'Please input Address!' }]}
                  style={stylingObject.formItem}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  label="Method"
                  name="method"
                  rules={[{ required: true, message: 'Please select Method!' }]}
                  style={stylingObject.formItem}
                >
                  <Select
                    placeholder={`Select Method`}
                    options={[{value:'POST'}, {value:'GET'}]}
                  />
                </Form.Item>
                <Form.Item
                  label="Headers"
                  name="header"
                  rules={[{ required: true, message: 'Please add Headers!' }]}
                  style={stylingObject.formItem}
                >
                  <TextArea rows={4}/>
                </Form.Item>
              </>
            }

            { ( objectTypeId===REPLACE || objectTypeId===REMOVE || objectTypeId===RESULT || objectTypeId===RESPONSE ) &&

              <Form.Item
                label="JSON"
                name="json"
                style={stylingObject.formItem}
              >
                <TextArea
                  rows={4}
                  placeholder={`Add ${typeIdToName(objectTypeId)} example`}/>
              </Form.Item>
            }

            { objectTypeId===RESULT &&
              <Form.Item
                label="JSONata"
                name="jsonata"
                style={stylingObject.formItem}
              >
                <TextArea rows={4} placeholder={'Add JSONata which will be used to check response from the server'}/>
              </Form.Item>
            }

            <SelectChildren typeId={SERVER} options={server} multiple={false} children={children}/>
            <SelectChildren typeId={COLLECTION} options={collection} multiple={true} children={children}/>
            <SelectChildren typeId={SUITE} options={suite} multiple={true} children={children}/>
            <SelectChildren typeId={CASE} options={cAse} multiple={true} children={children}/>
            <SelectChildren typeId={BODY} options={body} multiple={false} children={children}/>
            <SelectChildren typeId={TEST} options={test} multiple={false} children={children}/>
            <SelectChildren typeId={REPLACE} options={replace} multiple={false} children={children}/>
            <SelectChildren typeId={REMOVE} options={remove} multiple={false} children={children}/>
            <SelectChildren typeId={RESULT} options={result} multiple={false} children={children}/>
            <SelectChildren typeId={RESPONSE} options={response} multiple={false} children={children}/>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{float:'right'}}>
                { componentQaObject ? 'Update' : 'Create New' }
              </Button>
            </Form.Item>
      </Form>
    </Modal>
  </>
}

export default ObjectNewTest
