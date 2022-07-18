import {Modal, Popconfirm, Table, Tag, Tooltip} from "antd";
import React, {useState} from "react";
import {dateFormatYYYYMMDDHHmmss} from "src/global";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import OrganizationEdit from "src/components/Organizations/OrganizationEdit/OrganizationEdit";

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
  const [data, setData] = useState( organizations );
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'email',
      render: (_, record) =>
        record.id
    },
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
                <EditOrganizationModal organization={record} OnUserAction={ () => {} }/>
            </span>
          }
        </>

    },
  ];
  return (
    <>
      <EditOrganizationModal organization={null} OnUserAction={ () => {} }/>
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
    </>

  )
}

export default Organizations
