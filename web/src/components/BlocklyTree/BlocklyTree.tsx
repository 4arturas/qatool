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
    }
  }
`


const BlocklyTree = ( { id }) => {

  const client = useApolloClient();
  const { hasRole } = useAuth();

  const [loading, setLoading] = useState( false );

  const initBlocklyObjects = () =>
  {
    const experimentJSON = {
      "message0": "EXPERIMENT %1 name: %2 %3 Server %4 Collection(s): %5",
      "args0": [
        {
          "type": "input_dummy",
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": ""
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "input_value",
          "name": "SERVER",
          "check": "serverCheck"
        },
        {
          "type": "input_statement",
          "name": "COLLECTIONS",
          "check": "collection"
        }
      ],
      "colour": `${typeIdToColor(EXPERIMENT)}`,
      "tooltip": "",
      "helpUrl": ""
    };
    Blockly.Blocks['experiment'] = {
      init: function() {
        this.jsonInit(experimentJSON);
        // Assign 'this' to a variable for use in the tooltip closure below.
        // var thisBlock = this;
        // this.setTooltip(function() {
        //   return 'Add a number to variable "%1".'.replace('%1',
        //     thisBlock.getFieldValue('VAR'));
        // });
      },
      onchange: function ( e )
      {
      }
    };
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

  useEffect( () => {

    setLoading( true );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {

        Blockly.common.defineBlocksWithJsonArray(comp);
        initBlocklyObjects();

        const workspace = ( Blockly.inject('ide', { toolbox: toolbox,   move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: true} } ) );

        const tmpTree = ret.data.tree;
        const parentId = tmpTree.parentId;
        const qaObject = tmpTree.objects.find( o => o.id === parentId );

        setLoading(false);

        fetchTree2( null, qaObject, null, tmpTree );

        Blockly.serialization.workspaces.load(firstBlock, workspace);
      });
  }, [] );



  return <></>
}

export default BlocklyTree
