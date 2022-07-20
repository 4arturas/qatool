import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {typeIdToColor, typeIdToName} from "src/global";
import {Popconfirm, Tooltip} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const DETACH_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation DetachQaObjectRelationshipMutation($id: Int!) {
  detachQaObjectRelationship(id: $id) {
    id
  }
}
`

const ObjectDetach = ( { relationId, qaObject, beforeSave, afterSave }) => {
  const [detachQaObjectRelationship] = useMutation(DETACH_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
      toast.success('QaObject detached');
      // afterSave(id);
      // window.location.reload();
      // navigate(routes.tmpQaObject( { page: page, pageSize: pageSize } ) );
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const stylingObject = {
    icon: { fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(qaObject.typeId)}` }
  }

  return (
    <Tooltip title={`Detach ${typeIdToName(qaObject.typeId)}`}>
    <Popconfirm
      title="Are you sure to detach this item?"
      onConfirm={ () => {
        beforeSave();
        detachQaObjectRelationship({ variables: { id: relationId } })
        afterSave();
      }
      }
      // onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <FontAwesomeIcon
        icon={faLink}
        style={stylingObject.icon}
        onClick={ ()=>{} }/>


    </Popconfirm>
    </Tooltip>
  )
}

export default ObjectDetach
