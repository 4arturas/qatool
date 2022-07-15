import {Modal, Popconfirm, Table, Tag, Tooltip} from "antd";
import React, {useState} from "react";
import {faPen, faTrash,faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useApolloClient} from "@apollo/client";
import UserEditCell from 'src/components/UserEditCell'
import {dateFormatYYYYMMDDHHmmss} from "src/global";
import UserEdit from "src/components/UserEdit/UserEdit";
import {Toaster} from "@redwoodjs/web/toast";

const stylingObject = {
  edit: {
    cursor: 'pointer'
  },
  delete: {
    cursor: 'pointer'
  },
}

const EditUserModal = ( { user, OnUserAction } ) =>
{
  const [isModalVisible, setIsModalVisible] = useState(false);

  const OnSubmitFormFunction = (formValues:any) => {
    OnUserAction( formValues );
    setIsModalVisible(false);
  }

  return <>
    {
      user ?
      <Tooltip title={'Update User'}>
        <FontAwesomeIcon
          icon={faPen}
          style={stylingObject.edit}
          onClick={() => setIsModalVisible(true)}
        />
      </Tooltip>
        :
      <span style={{marginRight:'20px', float: 'right'}}>
        <Tooltip title={'Create New User'}>
          <FontAwesomeIcon
            icon={faCirclePlus}
            style={stylingObject.edit}
            onClick={() => setIsModalVisible(true)}
          />
        </Tooltip>
      </span>
    }
    <Modal
      title={'User'}
      visible={isModalVisible}
      onOk={ () => { setIsModalVisible(false); } }
      onCancel={ () => { setIsModalVisible(false); } }
      footer={null}
      destroyOnClose={true}
    >
      {
        user ?
        <UserEditCell id={user.id} OnSubmitFormFunction={OnSubmitFormFunction}/>
          :
        <UserEdit user={null} OnSubmitFormFunction={OnSubmitFormFunction}/>
      }
    </Modal>
  </>

}

const Users = ( {users} ) => {
  const [data, setData] = useState( users );

  const client = useApolloClient();

  const reformatUserRoles = ( formValues ) => formValues.map( roleName => { return { name: roleName } } );
  const OnUserUpdate = ( formValues ) =>
  {
    const newDataArray = data.map( u => {
      if ( u.id !== formValues.id )
        return u;
      const replaceData = { ...u }
      replaceData.email = formValues.email;
      replaceData.userRoles = reformatUserRoles( formValues.userRoles );

      return replaceData;
    } );
    setData(newDataArray);
  }

  const OnUserInsert = ( formValues ) =>
  {
    const newDataArray = [...data];
    const newUser = { id: formValues.id, email: formValues.email, userRoles: reformatUserRoles( formValues.userRoles) };
    newDataArray.push( newUser );

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
        record.userRoles.map( role => <Tag key={`${role.name}${record.id}`}>{role.name}</Tag> )
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
              <EditUserModal user={record} OnUserAction={OnUserUpdate}/>
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
                <Tooltip title={'Delete User'}>
                  <FontAwesomeIcon icon={faTrash} style={stylingObject.delete}/>
                </Tooltip>
          </Popconfirm>
          </span>
          }
        </>

    },
    ];
  return <>
    <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
    <EditUserModal user={null} OnUserAction={OnUserInsert}/>
    <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
  </>
}

export default Users
