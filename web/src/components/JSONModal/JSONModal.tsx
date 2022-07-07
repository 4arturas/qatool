import React, {useState} from "react";
import {Button, Modal} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBinoculars} from "@fortawesome/free-solid-svg-icons";

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

        setJsonPretty( JSON.stringify(JSON.parse(json), null, 2) );
      } }
    />
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width={'50%'}
    >
      <div style={{textAlign: 'center'}}>
        <textarea defaultValue={jsonPretty} style={{width:'100%', height:'600px'}}/>
      </div>
    </Modal>
  </>
}

export default JsonModal
