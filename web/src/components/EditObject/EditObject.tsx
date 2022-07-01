import React, {useState} from "react";
import {useLazyQuery} from "@apollo/client";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, getChildrenFromInput} from "src/global";
import {CopyOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {Button, Modal} from "antd";
import QaObjectForm from "src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectForm";
import {navigate, routes} from "@redwoodjs/router";

export const EDIT_OBJECT_UPDATE   = 1;
export const EDIT_OBJECT_CLONE    = 2;
export const EDIT_OBJECT_NEW      = 3;

const EditObject = ({ object, type, afterUpdated, afterSaved }) => {
  const UPDATE_QA_OBJECT_MUTATION = gql`
  mutation UpdateQaObjectMutation($id: Int!, $input: UpdateQaObjectInput!) {
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

  const FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID = gql`
  query FindRelationshipsWithTheSameParentId($parentId: Int!) {
    qaObjectRelationshipsWithTheSameParentId(parentId: $parentId) {
      id
      parentId
      childrenId
    }
  }
`

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [parentId, setParentId] = useState(0);
  const [children, setChildren] = useState([]);

  const [loadChildren, { called, loading: l, data }] = useLazyQuery(FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID, {
    variables: { parentId },
  });

  const [deleteQaObjectRelationship] = useMutation(DELETE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
    },
    onError: (error) => {
    },
  })

  const [updateQaObject, { loading: loadingUpdateQaObject, error: errorUpdateQaObject }] = useMutation(UPDATE_QA_OBJECT_MUTATION, {

    onCompleted: async () => {
      const queryResult = await loadChildren();
      const data = queryResult.data.qaObjectRelationshipsWithTheSameParentId;
      data.map((p)=> {
        const id = p.id;
        deleteQaObjectRelationship({ variables: { id } });
      });

      children.map( (childrenId) => {
        const castInput = { parentId: parentId, childrenId: parseInt(childrenId) };
        createQaObjectRelationship({ variables: { input: castInput } });
      });

      toast.success('QaObject updated')
      setIsModalVisible(false);
      afterUpdated();
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {

    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onUpdate = (input, id) => {
    const childrenFromInput: Array<number> = getChildrenFromInput(input);
    setChildren( childrenFromInput );

    setParentId(id);

    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    updateQaObject({ variables: { id, input: castInput } })
  }


  const onSave = (input) => {

  }

  return (
    <>
      {
        (type===EDIT_OBJECT_UPDATE) ?
        <EditOutlined onClick={showModal} style={{fontSize:'20px'}}/> :
          (type===EDIT_OBJECT_CLONE) ?
            <CopyOutlined onClick={showModal} style={{fontSize:'20px'}} /> :
            <PlusCircleOutlined onClick={showModal} style={{fontSize:'20px'}} />

      }
      <Modal
        title={ (type===EDIT_OBJECT_UPDATE) ? 'Update' : ( type===EDIT_OBJECT_CLONE) ? 'Clone' : 'Create' }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <QaObjectForm
          qaObject={object}
          onSave={(type===EDIT_OBJECT_UPDATE)?onUpdate:onSave}
          error={(type===EDIT_OBJECT_UPDATE)?errorUpdateQaObject:null}
          loading={(type===EDIT_OBJECT_UPDATE)?loadingUpdateQaObject:null}
          submitName={ (type===EDIT_OBJECT_UPDATE) ? 'Update' : ( type===EDIT_OBJECT_CLONE) ? 'Clone' : 'Create' } />
      </Modal>
    </>
  );
}

export default EditObject
