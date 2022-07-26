import {Button, Form, Input, Modal, Tag, Tooltip} from "antd";
import {typeIdToColor, typeIdToName} from "src/global";
import {toast} from "@redwoodjs/web/toast";
import React, {useState} from "react";
import {useApolloClient} from "@apollo/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClone} from "@fortawesome/free-solid-svg-icons";
import {routes} from "@redwoodjs/router";

const ObjectDeepClone = ( { qaObject, beforeSave, afterSave } ) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const client = useApolloClient();
  const [clonedQaObject, setClonedQaObject] = useState(null);

  return (
    <>
      <Tooltip title={`Deep Clone ${typeIdToName(qaObject.typeId)}`}>
        <FontAwesomeIcon
          icon={faClone}
          style={{ fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(qaObject.typeId)}`, marginBottom: '-3px' }}
          onClick={ () => {
            setIsModalVisible(true);
          } }
        />
      </Tooltip>

    <Modal
      title={ <Tag color={typeIdToColor(qaObject.typeId)} style={{color:'black'}}>{`Deep Clone ${typeIdToName(qaObject.typeId)}`}</Tag> }
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      destroyOnClose={true}
      footer={null}
      width={'50%'}
    >
      {clonedQaObject ?
        <>
          <a href={routes.tree({id: clonedQaObject.id})}>Click me to visit</a> <Tag color={typeIdToColor(clonedQaObject.typeId)}>{typeIdToName(clonedQaObject.typeId)}</Tag> - {clonedQaObject.name}
        </>
        :
        <Form
          form={form}
          name="basic"
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          initialValues={qaObject}
          onFinish={(values: any) => {
            beforeSave();
            const DEEP_CLONE = gql`
                  mutation DeepClone($id: Int!, $name: String!) {
                    deepClone(id: $id, name: $name) {
                      id
                      typeId
                      name
                    }
                  }`;
            client.mutate({
            mutation: DEEP_CLONE,
            variables: {id: qaObject.id, name: values.name}
            })
            .then( ret => {
              toast.success('Object was deeply cloned' );
              setClonedQaObject( ret.data.deepClone );
              afterSave( ret.data.deepClone );
            })
            .catch( error => {
              toast.error( error.message );
              setIsModalVisible(false);
            } );
            }
          }
          onFinishFailed={(errorInfo: any) => {
          console.log('Failed:', errorInfo);
        }}
          autoComplete="off"
          >
          <Form.Item
          label="Name"
          name="name"
          rules={[{required: true, message: 'Please input name!'}]}
          style={{}}
          >
          <Input/>
          </Form.Item>

          <Form.Item>
          <Button type="primary" htmlType="submit" style={{float:'right', backgroundColor: `${typeIdToColor(qaObject.typeId)}`, color: 'black'}}>
          Deep Clone
          </Button>
          </Form.Item>
        </Form>
      }
      </Modal>
    </>
  )
}

export default ObjectDeepClone
