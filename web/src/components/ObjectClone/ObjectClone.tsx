import React, {useState} from "react";
import {useMutation} from "@redwoodjs/web";
import {
  BODY,
  CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, getChildrenFromInput, REMOVE,
  REPLACE, RESPONSE, RESULT,
  TEST
} from "src/global";
import {toast} from "@redwoodjs/web/toast";
import {CopyOutlined} from "@ant-design/icons";
import {Modal} from "antd";
import QaObjectForm from "src/components/QaObjectForm";

const CREATE_QA_OBJECT_MUTATION = gql`
  mutation CreateQaObjectMutationCloneQaObject($input: CreateQaObjectInput!) {
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

const ObjectClone = ({parentId, qaObject, beforeSave, afterSave}) => {
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

  const onSave = (input) => {
    const typeId: number = parseInt(input.typeId);
    const children: Array<number> = getChildrenFromInput(input);

    const castInput = Object.assign(input, { typeId: typeId, batchId: parseInt(input.batchId), })
    const data = createQaObject({ variables: { input: castInput } });
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
      afterSave(newCreateQaObject)
      toast.success('QaObject created')
      setIsModalVisible(false);
    });
  }

  return (
    <>
      <CopyOutlined onClick={()=>setIsModalVisible(true)} style={{fontSize:'20px'}} />

      <Modal
        title={ 'New Object' }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        footer={null}
      >
        <QaObjectForm
          qaObject={qaObject}
          onSave={(input) => {
            beforeSave();

            { // Delete data not belonging to the input
              input.typeId = parseInt(input.typeId);
              const childrenFragment: string = 'children';
              if (input[childrenFragment]) {

                delete input[childrenFragment];
              }

              const childrenIDArr: Array<string> = [`${childrenFragment}${BODY}`, `${childrenFragment}${TEST}`, `${childrenFragment}${REPLACE}`, `${childrenFragment}${REMOVE}`, `${childrenFragment}${RESULT}`, `${childrenFragment}${RESPONSE}`];
              childrenIDArr.map((c) => {
                if (input[c]) {
                  delete input[c];
                }
              });
            }
            const data = createQaObject({ variables: { input: input } });

            data.then( (ret) => {
              const newCreateQaObject = ret.data.createQaObject;
              const childrenId: number = newCreateQaObject.id;
              if ( parentId )
              {
                const castInput = { parentId: parentId, childrenId: childrenId };
                const ret = /*await*/ createQaObjectRelationship({ variables: { input: castInput } });
                // const createQaObjectRelationshipRet = ret.data.createQaObjectRelationship;
              }

              toast.success('Object cloned')
              setIsModalVisible(false);

              afterSave(newCreateQaObject)
            });
          }}
          error={errorSavingNew}
          loading={loadingSaveNew}
          submitName={ 'Clone Object' } />
      </Modal>
    </>
  );
}

export default ObjectClone
