import React, {useState} from "react";
import {Modal} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBinoculars} from "@fortawesome/free-solid-svg-icons";
import ReactJson from "react-json-view";

const JsonModal = ({ title, json }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jsonPretty, setJsonPretty] = useState(null);

  return <>
    <FontAwesomeIcon
      icon={faBinoculars}
      style={{fontSize:'15px', cursor: 'pointer'}}
      onClick={ ()=> {
        setIsModalVisible(true)
        if ( jsonPretty )
          return;

        setJsonPretty( JSON.parse(json) );
      } }
    />
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
    >
      <ReactJson src={jsonPretty} style={{maxHeight:'800px', overflow: 'auto'}}/>
    </Modal>
  </>
}

export default JsonModal
