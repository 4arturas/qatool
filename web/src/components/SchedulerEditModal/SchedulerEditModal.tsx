import {Modal, Tooltip} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar, faEdit} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import SchedulerCell from "src/components/Scheduler/SchedulerEditCell"

const SchedulerEditModal = ({id}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      <SchedulerCell id={id}/>
    </Modal>
  </>
  )
}

export default SchedulerEditModal
