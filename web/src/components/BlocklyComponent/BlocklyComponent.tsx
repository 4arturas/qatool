import {useEffect} from "react";
import {comp, toolbox} from "./components";
import Blockly from 'blockly';

const BlocklyComponent = () => {

  useEffect(()=> {
    Blockly.common.defineBlocksWithJsonArray(comp);
    Blockly.inject('ide', { toolbox: toolbox } );
  }, [] );

  return (
      <div id="ide" style={{width:'100%', height: '400px'}}></div>
  )
}

export default BlocklyComponent
