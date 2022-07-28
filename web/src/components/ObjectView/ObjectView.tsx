import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import {Modal, Tag, Tooltip} from "antd";
import {
  BODY,
  CASE,
  COLLECTION,
  REMOVE,
  REPLACE,
  RESPONSE, RESULT,
  SERVER,
  SUITE,
  typeIdToColor,
  typeIdToName
} from "src/global";

import './ObjectView.css'
import ReactJson from "react-json-view";

const ObjectView = ( {qaObject} ) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jsonPretty, setJsonPretty] = useState(null);

  return (
    <>
      <Tooltip title={`View ${typeIdToName(qaObject.typeId)}`}>
      <FontAwesomeIcon
        icon={faEye}
        onClick={()=>{
          setIsModalVisible(true);

          if ( !qaObject.json || jsonPretty )
            return;

          setJsonPretty( JSON.parse(qaObject.json) );
        }}
        style={{fontSize: '20px', cursor: "pointer", color: `${typeIdToColor(qaObject.typeId)}`, marginBottom: '-2px'}}/>
      </Tooltip>

      <Modal
        title={ <Tag color={typeIdToColor(qaObject.typeId)} style={{color:'black'}}>{<FontAwesomeIcon icon={faEye}/>}{` ${typeIdToName(qaObject.typeId)}`}</Tag> }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        footer={null}
        destroyOnClose={true}
      >
        <table className='ObjectView'>
          <tbody>
          <tr>
            <td>Name:</td>
            <td>{qaObject.name}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{qaObject.description}</td>
          </tr>
          { ( qaObject.typeId === SERVER ) &&
            <>
            <tr>
              <td>Address:</td>
              <td>{qaObject.address}</td>
            </tr>
            <tr>
              <td>Method:</td>
              <td>{qaObject.method}</td>
            </tr>
            <tr>
              <td>Headers:</td>
              <td>{qaObject.header}</td>
            </tr>
            </>
          }
          { ( qaObject.typeId === COLLECTION || qaObject.typeId === SUITE || qaObject.typeId === CASE ) &&
            <tr>
              <td>Batch Id:</td>
              <td>{qaObject.batchId}</td>
            </tr>
          }
          { ( qaObject.typeId === CASE ) &&
            <>
            <tr>
              <td>Users:</td>
              <td>{qaObject.threads}</td>
            </tr>
            <tr>
              <td>Requests:</td>
              <td>{qaObject.loops}</td>
            </tr>
            </>
          }
          { ( qaObject.typeId === BODY || qaObject.typeId === REPLACE || qaObject.typeId === REMOVE || qaObject.typeId === RESULT || qaObject.typeId === RESPONSE  ) &&
            <>
            <tr>
              <td>JSon:</td>
              <td>
                <ReactJson src={jsonPretty} style={{maxHeight:'800px', overflow: 'auto'}}/>
              </td>
            </tr>
            </>
          }
          { ( qaObject.typeId === RESULT ) &&
            <>
            <tr>
              <td>JSONata:</td>
              <td>{qaObject.jsonata}</td>
            </tr>
            </>
          }
          </tbody>
        </table>
      </Modal>
  </>
  )
}

export default ObjectView
