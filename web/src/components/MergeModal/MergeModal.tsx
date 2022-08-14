import {Modal, Tooltip} from "antd";
import React, {useState} from "react";
import {faCodeFork} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  TEST
} from "src/global";
import MergeCell from "src/components/MergeCell";

const MergeModal = ( {qaObject} ) => {

  if ( qaObject.typeId !== TEST ) return <></>;

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Tooltip title="Show Merge">
        <FontAwesomeIcon
          icon={faCodeFork}
          style={{fontSize:'20px', cursor: 'pointer'}}
          onClick={ () => {
            setIsModalVisible(true);
          } }/>
      </Tooltip>

      <Modal
        title={ 'Merge' }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        footer={null}
        width={'90%'}
      >
        { isModalVisible && <MergeCell testId={qaObject.id} /> }
      </Modal>
    </>
  );
}

export default MergeModal
