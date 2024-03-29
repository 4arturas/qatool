import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faCopy, faPen} from "@fortawesome/free-solid-svg-icons";
import {
  BODY,
  CASE,
  COLLECTION, CREATE_QA_OBJECT_RELATIONSHIP_MUTATION,
  getChildrenTypeIdByParentTypeId, prettifyJSon, REMOVE, REPLACE, RESPONSE, RESULT, SERVER, SUITE, TEST,
  typeIdToColor,
  typeIdToName,
  TYPES
} from "src/global";
import React, {useState} from "react";
import {Alert, Button, Form, Input, InputNumber, Modal, Select, Tag, Tooltip} from "antd";
import {useApolloClient} from "@apollo/client";
import {Spin} from "antd/es";
import {toast} from "@redwoodjs/web/toast";
import {useMutation} from "@redwoodjs/web";
import {useAuth} from "@redwoodjs/auth";
const { TextArea } = Input;

const FIND_QA_OBJECTS_BY_TYPE = gql`
  query FindQaObjectByTypeIdQuery($id: Int, $typeId: Int!) {
    getQaObjectsByType: getQaObjectsByType(id: $id, typeId: $typeId) {
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
      orgId
      organization { id name }
      parent { id parentId childrenId childrenObjectTypeId }
    }
  }`;

const UPDATE_QA_OBJECT_MUTATION = gql`
  mutation UpdateQaObjectMutation2($id: Int!, $input: UpdateQaObjectInput!) {
    updateQaObject(id: $id, input: $input) {
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
      executed
      orgId
      organization { id name }
      parent { id parentId childrenId childrenObjectTypeId }
    }
  }
`

const FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID = gql`
  query FindRelationships($parentId: Int!) {
    qaObjectRelationshipsWithTheSameParentId(parentId: $parentId) {
      id
      parentId
      childrenId
      childrenObjectTypeId
    }
  }
`

const DELETE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation DeleteQaObjectRelationshipMutation($id: Int!) {
    deleteQaObjectRelationship(id: $id) {
      id
    }
  }
`

const SPLIT_SYMBOL = '-';
const ObjectNewTest = ({typeId, qaObject, children, cloneObject, parentId, beforeSave, afterSave }) => {
  const client = useApolloClient();
  const { currentUser } = useAuth()

  const [componentQaObject, setComponentQaObject] = useState( qaObject );
  const [objectTypeId, setObjectTypeId] = useState( typeId );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [objectColor, setObjectColor] = useState( typeId ? typeIdToColor(typeId) : '' );

  const STATE_CHILDREN_DO_NOTHING         = 'Do nothing';
  const STATE_CHILDREN_LOADING            = 'Loading';
  const STATE_CHILDREN_CAN_NOT_FIND_ANY   = 'Can not find any'
  const [server, setServer] = useState(STATE_CHILDREN_DO_NOTHING );
  const [collection, setCollection] = useState(STATE_CHILDREN_DO_NOTHING );
  const [suite, setSuite] = useState(STATE_CHILDREN_DO_NOTHING );
  const [cAse, setCase] = useState(STATE_CHILDREN_DO_NOTHING );
  const [body, setBody] = useState(STATE_CHILDREN_DO_NOTHING );
  const [test, setTest] = useState(STATE_CHILDREN_DO_NOTHING );
  const [replace, setReplace] = useState(STATE_CHILDREN_DO_NOTHING );
  const [remove, setRemove] = useState(STATE_CHILDREN_DO_NOTHING );
  const [result, setResult] = useState(STATE_CHILDREN_DO_NOTHING );
  const [response, setResponse] = useState(STATE_CHILDREN_DO_NOTHING );

  const [organizations, setOrganizations] = useState( [] );

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

  const [updateQaObject, { loading: loadingUpdateQaObject, error: errorUpdateQaObject, data }] = useMutation(UPDATE_QA_OBJECT_MUTATION, {

    onCompleted: () => {

    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [deleteQaObjectRelationship] = useMutation(DELETE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
    },
    onError: (error) => {
    },
  })

  const getObjectByTypeId = async ( id:number, typeId:number, callback ) =>
  {
    const data = await client.query({
      query: FIND_QA_OBJECTS_BY_TYPE,
      variables: {id: id, typeId:typeId}
    });

    const children = data.data.getQaObjectsByType;
    callback( children.length === 0 ? STATE_CHILDREN_CAN_NOT_FIND_ANY : children );
  }
  const fetchChildren = ( id:number, typeId:number) =>
  {
    setServer(STATE_CHILDREN_DO_NOTHING );
    setCollection(STATE_CHILDREN_DO_NOTHING );
    setSuite(STATE_CHILDREN_DO_NOTHING );
    setCase(STATE_CHILDREN_DO_NOTHING );
    setBody(STATE_CHILDREN_DO_NOTHING );
    setTest(STATE_CHILDREN_DO_NOTHING );
    setReplace(STATE_CHILDREN_DO_NOTHING );
    setRemove(STATE_CHILDREN_DO_NOTHING );
    setResult(STATE_CHILDREN_DO_NOTHING );
    setResponse(STATE_CHILDREN_DO_NOTHING );

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
        callbackFunction( STATE_CHILDREN_LOADING );
        getObjectByTypeId( id, childrenTypeId, callbackFunction );
      }
    } );
  }
  const jsonValidator = (_,value) => {
    if ( value.length === 0 )
      return Promise.reject('Please add JSON!');
    try
    {
      JSON.parse(value);
      return Promise.resolve();
    }
    catch ( e )
    {
      return Promise.reject('Please check JSON format!');
    }
  }

  const [form] = Form.useForm();

  const stylingObject = {
    icon: { fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(typeId)}`, marginBottom: '-3px' },
    formItem: {},
    selectObjectType: {}
  }

  const convertQaObjectToOption = ( qaObject ) => ( { value: `${qaObject.id}${SPLIT_SYMBOL}${qaObject.typeId}`, label: qaObject.name } );

  const SelectChildren = ( { typeId, options, multiple, children }) => {

    const convertToOptions = ( qaObject ) => qaObject.map( qa => convertQaObjectToOption( qa ) );

    if ( options === STATE_CHILDREN_DO_NOTHING ) return <></>;
    if ( options === STATE_CHILDREN_LOADING ) return <div style={{textAlign:'right', padding:'10px'}}>Loading {typeIdToName(typeId)} <Spin/>ba</div>;
    if ( options === STATE_CHILDREN_CAN_NOT_FIND_ANY ) return <div style={{textAlign:'left', paddingBottom:'10px'}}><Alert showIcon type={'warning'} message={<Tag color={typeIdToColor(typeId)} style={{color:'black'}}>{typeIdToName(typeId)}</Tag>} description={'is missing, please create one'}/></div>;

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

  const [icon] = useState(cloneObject ? faCopy : componentQaObject ? faPen : faCirclePlus);

  const PrettifyButton = ( { textAreaId } ) =>
  {
    return <div style={{width:'100%', textAlign:'right', marginBottom:'10px', marginTop:'-20px'}}>
      <Button
      onClick={ () => {
        const textArea = document.getElementById(textAreaId);
        const prettifiedJSon = prettifyJSon( textArea.value );
        textArea.value = prettifiedJSon;
      }}>
      Prettify
    </Button>
    </div>
  }

  return <>

    <Tooltip title={icon===faCopy?`Clone ${typeIdToName(typeId)}`: (icon===faPen) ? `Edit ${typeIdToName(typeId)}` : `New ${typeIdToName(typeId)}`}>
    <FontAwesomeIcon
      icon={icon}
      style={stylingObject.icon}
      onClick={ () => {
        fetchChildren( qaObject?.id, typeId );

        const GET_ORGANIZATIONS = gql`
          query GetOrganizations {
            organizations: getOrganizations {
              id
              name
            }
          }
        `
        client.query({
          query: GET_ORGANIZATIONS
        }).then( ret => {
          setOrganizations( ret.data.organizations );
        } );

        if ( componentQaObject )
        {
          const newQaObject = { ...qaObject };
          // newQaObject['childrenId3'] = [{ value: "19-3", label: "S" }];
          // newQaObject['childrenId2'] = [{ value: "20-2", label: "C" }];
          children.map( (qaObjectChildren) => {
            const memberName = `childrenId${qaObjectChildren.typeId}`
            if ( !newQaObject[memberName] )
              newQaObject[memberName] = [];
            newQaObject[memberName].push( `${qaObjectChildren.id}${SPLIT_SYMBOL}${qaObjectChildren.typeId}`);
          });
          setComponentQaObject( newQaObject );
        }
        setIsModalVisible(true) } }
    />
    </Tooltip>
    <Modal
      title={ <Tag color={typeIdToColor(objectTypeId)} style={{color:'black'}}>{cloneObject ? 'Clone ' : componentQaObject ? 'Update ' : 'Create New '} {typeIdToName(objectTypeId)}</Tag> }
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      destroyOnClose={true}
      footer={null}
      width={'50%'}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={ componentQaObject ? componentQaObject : { typeId:typeId, orgId: currentUser.orgId } }
        onFinish={ (values: any) => {
          beforeSave();
          const children = [];
          Object.keys(values).map(k => {
            if (k.indexOf('childrenId') !== -1) {
              const childrenId = values[k];
              const splitC = (val) => {
                const s = val.split(SPLIT_SYMBOL);
                return {childrenId: s[0], childrenObjectTypeId: s[1]}
              }
              if (Array.isArray(childrenId)) {
                childrenId.map(c => children.push(splitC(c)));
              } else {
                children.push(splitC(childrenId));
              }
              delete values[k];
            }
          });

          // TODO: implement child management on server side
          if ( !componentQaObject || cloneObject ) // new object
          {
            const data = createQaObject({variables: {input: values}});

            data.then( async (ret) => {
              const newCreateQaObject = ret.data.createQaObject;
              const childParentId: number = newCreateQaObject.id;

              children.map(async (c) => {
                const castInput = {
                  parentId: childParentId,
                  childrenId: (c.childrenId * 1),
                  childrenObjectTypeId: (c.childrenObjectTypeId * 1)
                };
                const ret = await createQaObjectRelationship({variables: {input: castInput}});
              });

              if ( parentId )
              {
                const castInput = { parentId: parentId, childrenId: childParentId, childrenObjectTypeId: typeId };
                const ret = await createQaObjectRelationship({ variables: { input: castInput } });
                // const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
              }

              toast.success(cloneObject ? 'Object cloned' : 'New Object created')
              setIsModalVisible(false);

              afterSave(newCreateQaObject);

            })

          } // new object end
          else // update object
          {

            // const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
            const id = componentQaObject.id;
            delete values.typeId;
            const data = updateQaObject({ variables: {  id: id, input: values } })
            data.then( async ( ret ) => {
              const queryResult = await client.query({
                query: FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID,
                variables: { parentId: id }
              });
              const data = queryResult.data.qaObjectRelationshipsWithTheSameParentId;
              data.map((p)=> {
                const id = p.id;
                deleteQaObjectRelationship({ variables: { id } });
              });

              children.map( (childrenId) => {
                const castInput = { parentId: id, childrenId: parseInt(childrenId.childrenId), childrenObjectTypeId: parseInt(childrenId.childrenObjectTypeId) };
                createQaObjectRelationship({ variables: { input: castInput } });
              });

              toast.success('QaObject updated')

              setIsModalVisible(false);
              afterSave( ret.data.updateQaObject );
            });
          }
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
                options={
                  qaObject ? [ { value: qaObject.typeId, label: typeIdToName( qaObject.typeId ) } ] :
                    typeId ? [{ value: typeId, label: typeIdToName(typeId) }] :
                    TYPES.map( typeId => { return { value: typeId, label: typeIdToName(typeId) } } )
                }
                onChange={ (typeId) =>
                {
                  setObjectTypeId(typeId);
                  setObjectColor( typeIdToColor(typeId));
                  fetchChildren( qaObject?.id, typeId );
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
              label="Organization"
              name="orgId"
              rules={[{ required: true, message: 'Please select organization!' }]}
              style={stylingObject.formItem}
            >
              <Select
                placeholder={`Select organization`}
                options={ organizations.map(o=>{ return {value:o.id, label:o.name}; } ) }
              />
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
                rules={[{ required: true, message: 'Please input batch id!' }]}
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
                  rules={[
                    { required: true, validator:  jsonValidator }
                  ]}
                  style={stylingObject.formItem}
                >
                  <TextArea
                    id='textAreaHeader'
                    rows={4}/>
                </Form.Item>
                <PrettifyButton textAreaId='textAreaHeader'/>
              </>
            }

            { ( objectTypeId===BODY || objectTypeId===REPLACE || objectTypeId===REMOVE || objectTypeId===RESULT || objectTypeId===RESPONSE ) &&
              <>
                <Form.Item
                  label="JSON"
                  name="json"
                  style={stylingObject.formItem}
                  rules={[
                    { required: true, validator:  jsonValidator }
                  ]}
                >
                  <TextArea
                    id='textAreaJSON'
                    rows={4}
                    placeholder={`Add ${typeIdToName(objectTypeId)} example`}/>
                </Form.Item>
                <PrettifyButton textAreaId='textAreaJSON'/>
              </>
            }

            { objectTypeId===RESULT &&
              <Form.Item
                label="JSONata"
                name="jsonata"
                rules={[{ required: true, message: 'Please add JSONata!' }]}
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
            <SelectChildren typeId={TEST} options={test} multiple={true} children={children}/>
            <SelectChildren typeId={REPLACE} options={replace} multiple={false} children={children}/>
            <SelectChildren typeId={REMOVE} options={remove} multiple={false} children={children}/>
            <SelectChildren typeId={RESULT} options={result} multiple={false} children={children}/>
            <SelectChildren typeId={RESPONSE} options={response} multiple={false} children={children}/>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{float:'right', backgroundColor: `${objectColor}`, color: 'black'}}>
                { cloneObject ? 'Clone' : componentQaObject ? 'Update' : 'Create New' }
              </Button>
            </Form.Item>
      </Form>
    </Modal>
  </>
}

export default ObjectNewTest
