import {Modal, Popconfirm, Table, Tag} from "antd";
import React, {useState} from "react";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useApolloClient} from "@apollo/client";
import UserEditCell from 'src/components/UserEditCell'
import {dateFormatYYYYMMDDHHmmss} from "src/global";

const stylingObject = {
  edit: {
    cursor: 'pointer'
  },
  delete: {
    cursor: 'pointer'
  },
}

const EditUserModal = ( { user, OnUserUpdate } ) =>
{
  const [isModalVisible, setIsModalVisible] = useState(false);

  const OnSubmitFormFunction = (formValues:any) => {
    OnUserUpdate( formValues );
    setIsModalVisible(false);
  }

  return <>
    <FontAwesomeIcon
      icon={faPen}
      style={stylingObject.edit}
      onClick={()=>setIsModalVisible(true)}
    />
    <Modal
      title={'User'}
      visible={isModalVisible}
      onOk={ () => { setIsModalVisible(false); } }
      onCancel={ () => { setIsModalVisible(false); } }
      footer={null}
      destroyOnClose={true}
    >
      <UserEditCell id={user.id} OnSubmitFormFunction={OnSubmitFormFunction}/>
    </Modal>
  </>

}

const Users = ( {users} ) => {

  const [data, setData] = useState( users );

  const client = useApolloClient();

  const OnUserUpdate = ( formValues ) =>
  {
    const newDataArray = data.map( u => {
      if ( u.id !== formValues.id )
        return u;
      const replaceData = { ...u }
      replaceData.email = formValues.email;
      replaceData.userRoles = formValues.userRoles;
      return replaceData;
    } );
    setData(newDataArray);
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) =>
        record.email
    },
    {
      title: 'Roles',
      dataIndex: 'userRoles',
      key: 'userRoles',
      render: (_, record) =>
        record.userRoles.map( roleName => <Tag key={`${roleName}${record.id}`}>{roleName}</Tag> )
    },
    {
      title: 'Deleted',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (_, record) =>
      <>{ record.deleted && dateFormatYYYYMMDDHHmmss( record.deleted ) }</>
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) =>
        <>
          { !record.deleted &&
            <span>
              <EditUserModal user={record} OnUserUpdate={OnUserUpdate}/>
              &nbsp;&nbsp;

              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={async () => {
                  const DELETE_USER = gql`
                  mutation DeleteUser($id: Int!) {
                    deleteUser (id: $id)
                  }`;

                  const ret = await client.mutate({
                    mutation: DELETE_USER,
                    variables: {id: record.id}
                  });

                  const deletedUserId = ret.data.deleteUser;
                  const newDataArray = data.map( u => {
                    if ( u.id !== deletedUserId )
                      return u;
                    const deletedUser = { ... u };
                    deletedUser.deleted = new Date();
                    return deletedUser;
                  } );
                  setData(newDataArray);
                }
                }
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
           <FontAwesomeIcon
             icon={faTrash}
             style={stylingObject.delete}/>
          </Popconfirm>
          </span>
          }
        </>

    },
    ];
  return <>
    <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
  </>
}

export default Users
