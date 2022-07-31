import {useApolloClient} from "@apollo/client";
import {useAuth} from "@redwoodjs/auth";
import React, {useEffect, useState} from "react";
import {comp, restore_Blocks, restore_Object, toolbox} from "./components";
import Blockly from 'blockly';
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
  TEST
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

  const [tree, setTree] = useState(null);
  const [hierarchy, setHierarchy] = useState([]);
  const [objects, setObjects] = useState([]);
  const [qaObject, setQaObject] = useState( null );

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
  const fetchTree = ( tmpQaObject, tree ) => {

    if ( tmpQaObject.typeId === EXPERIMENT )
    {
      const experiment = tree.objects.find( o => o.id === tmpQaObject.id );
      const experimentBlock = restore_Object( null, experiment );
      blockBlock.push( experimentBlock );
      ///////////////////////////////////////////////////
      /// SERVER
      const serverChildrenId = experiment.parent.find( h => h.parentId === experiment.id && h.childrenObjectTypeId === SERVER );
      if ( serverChildrenId )
      {
        const server = tree.objects.find( s => s.id === serverChildrenId.childrenId );
        const serverBlock = restore_Object( experiment, server );
        append_ChildBlock( experimentBlock, 'SERVER', serverBlock );
      }

      ///////////////////////////////////////////////////
      /// COLLECTION
      const collectionChildrenIds = experiment.parent.filter( p => p.childrenId && p.childrenObjectTypeId === COLLECTION );
      if ( collectionChildrenIds.length > 0 )
      {
        collectionChildrenIds.map( c => {
          const collection = tree.objects.find( o => o.id === c.childrenId );
          let collectionBlock = restore_Object( experiment, collection );
          append_ChildBlock( experimentBlock, 'COLLECTIONS', collectionBlock );
          ///////////////////////////////////////////////////
          /// SUITE
          const suiteChildrenIds = collection.parent.filter(h => h.parentId === collection.id && h.childrenObjectTypeId === SUITE );
          if ( suiteChildrenIds.length > 0 )
          {
            suiteChildrenIds.map( s => {
              const suite = tree.objects.find( o => o.id === s.childrenId );
              let suiteBlock = restore_Object( collection, suite );
              append_ChildBlock( collectionBlock, 'SUITES', suiteBlock );
              ///////////////////////////////////////////////////
              /// CASE
              const caseChildrenIds = suite.parent.filter( h => h.parentId === suite.id && h.childrenObjectTypeId === CASE );
              if ( caseChildrenIds.length > 0 )
              {
                caseChildrenIds.map( c => {
                  const cAse = tree.objects.find( o => o.id === c.childrenId );
                  let caseBlock = restore_Object( suite, cAse );
                  append_ChildBlock( suiteBlock, 'CASES', caseBlock );
                  ///////////////////////////////////////////////////
                  /// BODY
                  const bodyChildren = cAse.parent.find( c => c.childrenObjectTypeId === BODY );
                  const body = tree.objects.find( b => b.id === bodyChildren.childrenId );
                  const bodyBlock = restore_Object( cAse, body );
                  append_ChildBlock( caseBlock, 'BODY', bodyBlock );
                  ///////////////////////////////////////////////////
                  /// TESTS
                  const testIds = cAse.parent.filter( c => c.childrenObjectTypeId === TEST );
                  if ( testIds.length > 0 )
                  {
                    testIds.map( tId => {
                      const test = tree.objects.find( t => t.id === tId.childrenId );
                      const replaceId = test.parent.find( r => r.childrenObjectTypeId === REPLACE ).childrenId;
                      const removeId = test.parent.find( r => r.childrenObjectTypeId === REMOVE ).childrenId;
                      const resultId = test.parent.find( r => r.childrenObjectTypeId === RESULT ).childrenId;
                      const responseId = test.parent.find( r => r.childrenObjectTypeId === RESPONSE ).childrenId;
                      const replace = tree.objects.find( r => r.id === replaceId );
                      const remove = tree.objects.find( r => r.id === removeId );
                      const result = tree.objects.find( r => r.id === resultId );
                      const response = tree.objects.find( r => r.id === responseId );

                      const testBlock = restore_Object( cAse, test );
                      append_ChildBlock( caseBlock, 'TESTS', testBlock );
                      const replaceBlock = restore_Object( test, replace );
                      const removeBlock = restore_Object( test, remove );
                      const resultBlock = restore_Object( test, result );
                      const responseBlock = restore_Object( test, response );
                      append_ChildBlock( testBlock, 'REPLACE', replaceBlock);
                      append_ChildBlock( testBlock, 'REMOVE', removeBlock);
                      append_ChildBlock( testBlock, 'RESULT', resultBlock);
                      append_ChildBlock( testBlock, 'RESPONSE', responseBlock);
                    }); // end map tests
                  }
                });

              } // end if case
            }); // end map suites;
          } // end if suites

        } ); // end map collections
      }   // end if collections
    }


  }


  let workspace;
  useEffect( () => {
    Blockly.common.defineBlocksWithJsonArray(comp);
    workspace = ( Blockly.inject('ide', { toolbox: toolbox,   move: {
        scrollbars: {
          horizontal: true,
          vertical: true
        },
        drag: true,
        wheel: true} } ) );

    setLoading( true );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {
        const tmpTree = ret.data.tree;
        setTree( tmpTree );
        const parentId = tmpTree.parentId;
        setHierarchy( tmpTree.hierarchy );
        setObjects( tmpTree.objects );
        const tmpQaObject = tmpTree.objects.find( o => o.id === parentId );
        setQaObject( tmpQaObject );
        setLoading(false);

        fetchTree2( null, tmpQaObject, null, tmpTree );
        // fetchTree(tmpQaObject, tmpTree);
        Blockly.serialization.workspaces.load(firstBlock, workspace);
      });
  }, [] );



  return <></>
}

export default BlocklyTree
