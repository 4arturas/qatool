import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {DeleteOutlined} from "@ant-design/icons";
import {Popconfirm, Tooltip} from "antd";

const DELETE_QA_OBJECT_WITH_CHILDREN = gql`
  mutation DeleteQaObjectWithChildrenMutation($id: Int!) {
    deleteQaObjectWithChildren(id: $id) {
      id
    }
  }
  `;

const ObjectDelete = ( { id, beforeSave, afterSave } ) => {


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
       <DeleteOutlined style={{fontSize:'20px'}}/>

      </Popconfirm>

    )
  }

export default ObjectDelete
