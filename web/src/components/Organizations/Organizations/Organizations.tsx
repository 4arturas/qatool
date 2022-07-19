import {Modal, Popconfirm, Table, Tag, Tooltip} from "antd";
import React, {useState} from "react";
import {dateFormatYYYYMMDDHHmmss} from "src/global";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import OrganizationEdit from "src/components/Organizations/OrganizationEdit/OrganizationEdit";
import {useApolloClient} from "@apollo/client";
import {toast} from "@redwoodjs/web/toast";

const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: Int!) {
    deleteOrganization (id: $id) {
      id
    }
  }`;

const stylingObject = {
  edit: {
    cursor: 'pointer'
  },
  delete: {
    cursor: 'pointer'
  },
}

const EditOrganizationModal = ( { organization, OnUserAction } ) =>
{
  const [isModalVisible, setIsModalVisible] = useState(false);

  const OnSubmitFormFunction = (formValues:any) => {
    OnUserAction( formValues );
    setIsModalVisible(false);
  }

  return <>
    {
      organization ?
        <Tooltip title={'Update Organization'}>
          <FontAwesomeIcon
            icon={faPen}
            style={stylingObject.edit}
            onClick={() => setIsModalVisible(true)}
          />
        </Tooltip>
        :
        <span style={{marginRight:'20px', float: 'right'}}>
        <Tooltip title={'Create New Organization'}>
          <FontAwesomeIcon
            icon={faCirclePlus}
            style={stylingObject.edit}
            onClick={() => setIsModalVisible(true)}
          />
        </Tooltip>
      </span>
    }
    <Modal
      title={'Organization'}
      visible={isModalVisible}
      onOk={ () => { setIsModalVisible(false); } }
      onCancel={ () => { setIsModalVisible(false); } }
      footer={null}
      destroyOnClose={true}
    >
      {
        organization ?
          <OrganizationEdit organization={organization} OnSubmitFormFunction={OnSubmitFormFunction}/>
          :
          <OrganizationEdit organization={null} OnSubmitFormFunction={OnSubmitFormFunction}/>
      }
    </Modal>
  </>

}

const Organizations = ( { organizations } ) => {
  const client = useApolloClient();
  const [data, setData] = useState( organizations );
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) =>
        record.name
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) =>
        <>
          { !record.deleted &&
            <span>
                <EditOrganizationModal
                  organization={record}
                  OnUserAction={ (updatedOrganization) => {
                    const newData = data.map( d => d.id === updatedOrganization.id ? updatedOrganization : d );
                    setData( newData );
                  } }/>

              &nbsp;&nbsp;&nbsp;
              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => {
                  client.mutate({
                    mutation: DELETE_ORGANIZATION,
                    variables: {id: record.id}
                  })
                  .then( res => {
                    const deletedOrganization = res.data.deleteOrganization;
                    const newData = data.filter( f => f.id !== deletedOrganization.id );
                    setData( newData );
                    toast.success( 'Organization was deleted' );
                  }).catch( error => {
                    toast.error( error.message )
                  } );
                }}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title={'Delete Organization'}>
                  <FontAwesomeIcon icon={faTrash} style={stylingObject.delete}/>
                </Tooltip>
          </Popconfirm>
            </span>
          }
        </>
    },
  ];
  return (
    <>
      <EditOrganizationModal
        organization={null}
        OnUserAction={ (newOrganization) => {
          const newData = [newOrganization];
          newData.push( ...data );
          setData( newData );
        } }/>
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
    </>

  )
}

export default Organizations
