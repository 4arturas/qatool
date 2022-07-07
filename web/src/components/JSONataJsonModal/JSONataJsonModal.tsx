import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCodeCompare, faNotEqual, faEquals} from "@fortawesome/free-solid-svg-icons";
import {Modal, Tooltip} from "antd";
import ReactJson from "react-json-view";
import {validateJSONata} from "src/global";

const JsoNataJsonModal = ({ title, JSONata, json }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jsonPretty, setJsonPretty] = useState(null);
  const [valid] = useState( validateJSONata( JSONata, json ) );

  return <>
    <Tooltip title={'Check Response with JSONata'}>
      <FontAwesomeIcon
        icon={faCodeCompare}
        style={{fontSize:'15px', cursor: 'pointer', color: `${valid?'black':'red'}`}}
        onClick={ ()=> {
          setIsModalVisible(true)
          if ( jsonPretty )
            return;

          setJsonPretty( JSON.parse(json) );
        } }
      />
    </Tooltip>
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
    >

      <div style={{fontWeight: 'bold'}}>{JSONata}</div>
      <div style={{textAlign:'center', padding: '10px'}}>
        <FontAwesomeIcon
          icon={valid?faEquals:faNotEqual}
          style={{fontSize:'25px', cursor: 'pointer', color: `${valid?'black':'red'}`}}/>
      </div>
      <div><ReactJson src={jsonPretty} style={{maxHeight:'800px', overflow: 'auto'}}/></div>

    </Modal>
  </>
}

export default JsoNataJsonModal
