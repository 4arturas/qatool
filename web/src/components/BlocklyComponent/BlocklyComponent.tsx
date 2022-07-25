import {useEffect} from "react";
import {comp, restore_Server, toolbox} from "./components";
import Blockly from 'blockly';

const BlocklyComponent = () => {

  useEffect(()=> {
    Blockly.common.defineBlocksWithJsonArray(comp);
    const workspace = Blockly.inject('ide', { toolbox: toolbox } );

    const workspaceJSon = restore_Server();
    console.log( workspaceJSon );
    Blockly.serialization.workspaces.load(workspaceJSon, workspace);
  }, [] );

  return (
      <div id="ide" style={{width:'100%', height: '400px'}}></div>
  )
}

export default BlocklyComponent
