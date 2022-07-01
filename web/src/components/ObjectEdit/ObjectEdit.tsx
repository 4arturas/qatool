import React, {useState} from "react";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {
  CREATE_QA_OBJECT_RELATIONSHIP_MUTATION,
  getChildrenFromInput,
} from "src/global";
import { EditOutlined} from "@ant-design/icons";
import {Modal} from "antd";
import QaObjectForm from "src/components/QaObjectForm";
import {useLazyQuery} from "@apollo/client";

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

const ObjectEdit = ({qaObject, beforeSave, afterSave}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parentId, setParentId] = useState(0);
  const [children, setChildren] = useState([]);


  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {

    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [loadChildren, { called, loading: l, data }] = useLazyQuery(FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID, {
    variables: { parentId },
  });

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
      afterSave();
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

  return (
    <>
      <EditOutlined onClick={()=>setIsModalVisible(true)} style={{fontSize:'20px'}} />

      <Modal
        title={ 'Edit Object' }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        footer={null}
      >
        <QaObjectForm
          qaObject={qaObject}
          onSave={(input, id) => {
              beforeSave();
              const childrenFromInput: Array<number> = getChildrenFromInput(input);
              setChildren( childrenFromInput );

              setParentId(id);

              const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
              updateQaObject({ variables: { id, input: castInput } })
            }
          }
          error={errorUpdateQaObject}
          loading={loadingUpdateQaObject}
          submitName={ 'Edit Object' } />
      </Modal>
    </>
  );
}

export default ObjectEdit
