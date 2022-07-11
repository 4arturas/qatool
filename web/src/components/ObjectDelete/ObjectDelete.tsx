import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {DeleteOutlined} from "@ant-design/icons";
import {Popconfirm, Tooltip} from "antd";
import {typeIdToColor} from "src/global";

const DELETE_QA_OBJECT_WITH_CHILDREN = gql`
  mutation DeleteQaObjectWithChildrenMutation($id: Int!) {
    deleteQaObjectWithChildren(id: $id)
  }
  `;

const ObjectDelete = ( { id, beforeSave, afterSave, typeId=null/*needed for the color*/ } ) => {


    const [deleteQaObjectWithChildren] = useMutation(DELETE_QA_OBJECT_WITH_CHILDREN, {
      onCompleted: () => {
        toast.success('QaObject deleted');
        // afterSave(id);
        // window.location.reload();
        // navigate(routes.tmpQaObject( { page: page, pageSize: pageSize } ) );
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const stylingObject = {
    icon: { fontSize: '20px', cursor: "pointer", color: `${typeId ? typeIdToColor(typeId): ''}` }
  }

    return (
      <Popconfirm
        title="Are you sure to delete this item?"
        onConfirm={ () => {
            beforeSave();
            deleteQaObjectWithChildren({ variables: { id } })
            afterSave(id);
          }
        }
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
       <DeleteOutlined style={stylingObject.icon}/>

      </Popconfirm>

    )
  }

export default ObjectDelete
