import {PlusCircleOutlined} from "@ant-design/icons";
import {Modal} from "antd";
import QaObjectForm from "src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectForm";
import React, {useState} from "react";
import {toast} from "@redwoodjs/web/toast";
import {useMutation} from "@redwoodjs/web";
import {
  CREATE_QA_OBJECT_RELATIONSHIP_MUTATION,
  getChildrenFromInput,
  typeIdToTag
} from "src/global";

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


const ObjectNew = ({parentId, typeId, beforeSave, afterSave}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    return (
      <>
        <PlusCircleOutlined onClick={()=>setIsModalVisible(true)} style={{fontSize:'20px'}} /><span style={{marginLeft:'3px'}}>{typeIdToTag(typeId)}</span>

        <Modal
          title={ 'New Object' }
          visible={isModalVisible}
          onOk={()=>setIsModalVisible(false)}
          onCancel={()=>setIsModalVisible(false)}
          footer={null}
        >
          <QaObjectForm
            qaObject={{typeId: typeId}}
            onSave={(input) => {
              beforeSave();

              input.typeId = parseInt(input.typeId);
              const children: Array<number> = getChildrenFromInput(input);

              const data = createQaObject({ variables: { input: input } });

              data.then( (ret) => {
                const newCreateQaObject = ret.data.createQaObject;
                const childParentId: number = newCreateQaObject.id;

                children.map( async (childrenId) => {
                  const castInput = { parentId: childParentId, childrenId: (childrenId*1) };
                  const ret = await createQaObjectRelationship({ variables: { input: castInput } });
                });

                if ( parentId )
                {
                  const castInput = { parentId: parentId, childrenId: childParentId };
                  const ret = /*await*/ createQaObjectRelationship({ variables: { input: castInput } });
                  // const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
                }

                toast.success('New Object created')
                setIsModalVisible(false);

                afterSave(newCreateQaObject)
              });
            }}
            error={errorSavingNew}
            loading={loadingSaveNew}
            submitName={ 'Create New Object' } />
        </Modal>
      </>
    );
  }

export default ObjectNew