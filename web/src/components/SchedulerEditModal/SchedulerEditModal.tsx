import {Modal, Tooltip} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar, faEdit} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import SchedulerCell from "src/components/Scheduler/SchedulerEditCell"
import schedulerEditModalContext from "src/components/Scheduler/schedulerEditModalContext";

const SchedulerEditModal = ({id}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [modalDetails] = useState({
    name: "Leaving this variable for example",
    closeModal: () => setIsModalVisible(false)
  });
  return (
    <>
    <Tooltip title={'Scheduler'}>
        <FontAwesomeIcon
          icon={faEdit}
          style={{fontSize: '20px', cursor: "pointer"}}
          onClick={() => {
            setIsModalVisible(true);
          }}
        />
    </Tooltip>

    <Modal
      title={'Scheduler'}
      visible={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      // width='90%'
      // style={{top: 5}}
      footer={null}
    >
      <schedulerEditModalContext.Provider value={modalDetails}>
        <SchedulerCell id={id}/>
      </schedulerEditModalContext.Provider>
    </Modal>
  </>
  )
}

export default SchedulerEditModal
