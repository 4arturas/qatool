import {QuestionCircleOutlined} from "@ant-design/icons";
import {Modal} from "antd";
import React, {useState} from "react";
import {EXPERIMENT, typeIdToTag} from "src/global";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const Help = ( { anchor, size= 15 } ) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const moveTo = ( a ) =>
  {
    const anchorToScroll = document.getElementById(a);
    // anchorObjectsToScroll.scrollIntoView({block:"nearest", behavior:"smooth"});
    anchorToScroll.scrollIntoView({behavior:"smooth"});
  }
  return <>
    <QuestionCircleOutlined
      style={{fontSize: `${size}px`, cursor: "pointer", marginLeft: '5px', marginRight:'-2px', color: 'black' }}
      onClick={ ()=> {
        setIsModalVisible(true);
        setTimeout( () => {
          moveTo( anchor );
        }, 500 );
      } }/>
    <Modal
      title={<> <QuestionCircleOutlined/><span style={{marginLeft: '10px', fontWeight: 'bold'}}>QA tool help</span></>}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width={'80%'}
      footer={null}
      destroyOnClose={true}
    >
      <div style={{overflowY:'auto', height: '500px'}}>
        <ul id='anchorContent'>
          <li onClick={ () => { moveTo('anchorObjects0' ); return false; } }>
            <h1>QA Objects</h1>
            <ul>
              <li onClick={ () => { moveTo('anchorObjects1' ); return false; } }>Experiment</li>
              <li onClick={ () => { moveTo('anchorObjects2' ); return false; } }>Server</li>
              <li onClick={ () => { moveTo('anchorObjects3' ); return false; } }>Collection</li>
              <li onClick={ () => { moveTo('anchorObjects4' ); return false; } }>Suite</li>
              <li onClick={ () => { moveTo('anchorObjects5' ); return false; } }>Case</li>
              <li onClick={ () => { moveTo('anchorObjects6' ); return false; } }>Body</li>
              <li onClick={ () => { moveTo('anchorObjects7' ); return false; } }>Test</li>
              <li onClick={ () => { moveTo('anchorObjects8' ); return false; } }>Replace</li>
              <li onClick={ () => { moveTo('anchorObjects9' ); return false; } }>Remove</li>
              <li onClick={ () => { moveTo('anchorObjects10' ); return false; } }>Result</li>
              <li onClick={ () => { moveTo('anchorObjects11' ); return false; } }>Response</li>
              <li onClick={ () => { moveTo('anchorObjects12' ); return false; } }>Server</li>
            </ul>
          </li>
          <li onClick={ () => { moveTo('anchorFunctions0' ); return false; } }>
            <h1>Functions on QA Objects</h1>
            <ul>
              <li onClick={ () => { moveTo('anchorFunctions1' ); return false; } }>View</li>
              <li onClick={ () => { moveTo('anchorFunctions2' ); return false; } }>Edit</li>
              <li onClick={ () => { moveTo('anchorFunctions3' ); return false; } }>Clone</li>
              <li onClick={ () => { moveTo('anchorFunctions4' ); return false; } }>Deep Clone</li>
              <li onClick={ () => { moveTo('anchorFunctions5' ); return false; } }>Delete</li>
              <li onClick={ () => { moveTo('anchorFunctions6' ); return false; } }>Detach</li>
            </ul>
          </li>
        </ul>
        <h1 id='anchorObjects0'>QA Objects</h1>
        <h2 id='anchorObjects1'>
          Experiment
        </h2>
        <p>
          All other objects is essentially connected to this object to run experiment.
        </p>
        <h2 id='anchorObjects2'>
          Server
        </h2>
        <p>
          Is used to fill API's adress, method and headers. Attachable to Experiment object.
        </p>
        <h2 id='anchorObjects3'>
          Collection
        </h2>
        <p>
          Is used to fill Batch ID. Attachable to Experiment object.
        </p>
        <h2 id='anchorObjects4'>
          Suite
        </h2>
        <p>
          Used to fill Batch ID. Is attachable to Collection object.
        </p>
        <h2 id='anchorObjects5'>
          Case
        </h2>
        <p>
          Is used to select how many users
        </p>
        <h2 id='anchorObjects6'>
          Body
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 id='anchorObjects7'>
          Test
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 id='anchorObjects8'>
          Replace
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 id='anchorObjects9'>
          Remove
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 id='anchorObjects10'>
          Result
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 id='anchorObjects11'>
          Response
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {/*Functions on QA Objects<*/}
        <h1 id='anchorFunctions0'>Functions on QA Objects</h1>
        <h2 id='anchorFunctions1'>
          View
        </h2>
        <p>
          Lets you see your object's description.
        </p>
        <h2 id='anchorFunctions2'>
          Edit
        </h2>
        <p>
          Lets you make changes to your selected object.
        </p>
        <h2 id='anchorFunctions3'>
          Clone
        </h2>
        <p>
          Lets you copy your selected object.
        </p>
        <h2 id='anchorFunctions4'>
          Deep Clone
        </h2>
        <p>
          Lets you to copy all attached objects to the selected one.
        </p>
        <h2 id='anchorFunctions5'>
          Delete
        </h2>
        <p>
          Deletes selected object.
        </p>
        <h2 id='anchorFunctions6'>
          Detach
        </h2>
        <p>
          Detaches selected object from the group.
        </p>
      </div>
    </Modal>
  </>
}
export default Help
