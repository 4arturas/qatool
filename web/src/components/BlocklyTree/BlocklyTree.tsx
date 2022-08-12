import {useApolloClient} from "@apollo/client";
import {useAuth} from "@redwoodjs/auth";
import React, {useEffect, useState} from "react";
import Blockly from 'blockly';
import {comp, initBlocklyObjects, restore_Blocks, restore_Object, toolbox} from "./components";
import {
  BODY,
  CASE,
  COLLECTION,
  EXPERIMENT,
  REMOVE,
  REPLACE,
  RESPONSE,
  RESULT,
  SERVER, SUITE,
  TEST, typeIdToColor
} from "src/global";
import {toast} from "@redwoodjs/web/toast";

const QUERY = gql`
  query FindBlocklyTreeQuery($id: Int!) {
    tree: fetchHierarchy(id: $id) {
      parentId
      hierarchy {
        id
        parentId
        childrenId
        childrenObjectTypeId
      }
      objects {
        id
        typeId
        name
        description
        batchId
        threads
        loops
        json
        jsonata
        address
        method
        header
        createdAt
        updatedAt
        executed
        orgId
        organization { id name }
        parent { id parentId childrenId childrenObjectTypeId }
      }
      organizations { id name }
    }
  }
`
const ADD_BLOCKLY = gql`
  mutation addBlockly($blocklyJsonOld: String!, $blocklyJsonNew: String!) {
    addBlockly(blocklyJsonOld: $blocklyJsonOld, blocklyJsonNew: $blocklyJsonNew)
  }`;



const BlocklyTree = ( { id }) => {

  const client = useApolloClient();
  const { hasRole } = useAuth();

  const [loading, setLoading] = useState( false );

  const [blocklyJsonOld, setBlocklyJsonOld] = useState(null);

  const addBlockly = ( blocklyJsonNew:string ) =>
  {
    client.mutate({
      mutation: ADD_BLOCKLY,
      variables: {blocklyJsonOld: blocklyJsonOld, blocklyJsonNew: blocklyJsonNew }
    })
      .then( res => {
        const result = res.data.addBlockly;
        console.log( result );
        toast.success( 'Blockly was added' );
      }).catch( error => {
      toast.error( error.message )
    } );
  }

  const RunBlocklyCode = () =>
  {
    // localStorage.setItem("workspace", JSON.stringify(jsonWorkspace));
    const jsonWorkspace = Blockly.serialization.workspaces.save(workspace);

    addBlockly( JSON.stringify(jsonWorkspace) );

    // console.log( generator.workspaceToCode(workspace ) );
    return;

    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap === 0) throw "Infinite loop.";\n';
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log( code );
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      eval(code);
    } catch (e) {
      alert(e);
    }

  }

  const append_ChildBlock = ( parentBlock, inputName:string, appendBlock ) =>
  {
    if ( !parentBlock )
      return;
    if ( !parentBlock.block )
    {
      if (!parentBlock.inputs[inputName]) {
        parentBlock.inputs[inputName] = appendBlock;
        return appendBlock;
      } else {
        let block = parentBlock.inputs[inputName].block;
        while (1) {
          if (!block.next) {
            block.next = appendBlock;
            break;
          }
          block = block.next.block;
          return block;
        }
      }
    }
    else {
      if (!parentBlock.block.inputs[inputName]) {
        parentBlock.block.inputs[inputName] = appendBlock;
        return appendBlock;
      } else {
        let block = parentBlock.block.inputs[inputName].block;
        while (1) {
          if (!block.next) {
            block.next = appendBlock;
            break;
          }
          block = block.next.block;
          return block;
        }
      }
    }
  }

  const [firstBlock] = useState( restore_Blocks() );
  const [blockBlock] = useState( firstBlock.blocks.blocks );

  const fetchTree2 = ( parentQaObject, qaObject, parentBlock, tree ) =>
  {
    const block = restore_Object( parentQaObject, qaObject );

    if ( blockBlock.length === 0 )
      blockBlock.push( block );

    let input = null;
    switch ( qaObject.typeId )
    {
      case SERVER:      input = 'SERVER';       break;
      case COLLECTION:  input = 'COLLECTIONS';  break;
      case SUITE:       input = 'SUITES';       break;
      case CASE:        input = 'CASES';        break;
      case BODY:        input = 'BODY';         break;
      case TEST:        input = 'TESTS';        break;
      case REPLACE:     input = 'REPLACE';      break;
      case REMOVE:      input = 'REMOVE';       break;
      case RESULT:      input = 'RESULT';       break;
      case RESPONSE:    input = 'RESPONSE';     break;
    }

    if ( input )
      append_ChildBlock( parentBlock, input, block );

    qaObject.parent.map( m => {
      const childrenQaObject = tree.objects.find( o => o.id === m.childrenId );
      fetchTree2( qaObject, childrenQaObject, block, tree );
    } );
  }

  const [workspace, setWorkspace] = useState( null );

  useEffect( () => {

    setLoading( true );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {

        // Blockly.common.defineBlocksWithJsonArray(comp);

        const generator = new Blockly.Generator('GENERATOR');
        initBlocklyObjects( generator, ret.data.tree.organizations );

        const ws = (Blockly.inject('ide', {
          toolbox: toolbox, move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: true
          }
        }));
        setWorkspace( ws );


/*        workspace.addChangeListener( () => {
          const code = generator.workspaceToCode( workspace );
          console.log( code );
          // document.getElementById('out').innerHTML = code;
        });*/



        const tmpTree = ret.data.tree;
        const parentId = tmpTree.parentId;
        const qaObject = tmpTree.objects.find( o => o.id === parentId );

        setLoading(false);

        fetchTree2( null, qaObject, null, tmpTree );

        Blockly.serialization.workspaces.load(firstBlock, ws);

        window.onresize = () => document.getElementById('ide').style.height = `${window.innerHeight-100}px`;

        const jsonWorkspace = Blockly.serialization.workspaces.save(ws);
        setBlocklyJsonOld( JSON.stringify(jsonWorkspace) );

      });
  }, [] );



  return (
    <>
      <div id="ide" style={{width:'100%', height: `${window.innerHeight-100}px`}}><button onClick={RunBlocklyCode}>Run Code</button></div>
    </>
  )
}

export default BlocklyTree
