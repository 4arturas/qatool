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
  getChildrenTypeIdByParentTypeId,
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

  const [hierarchy, setHierarchy] = useState([]);
  const [objects, setObjects] = useState([]);
  const [qaObject, setQaObject] = useState( null );

  const append_ChildBlock = ( collectionBlock, inputName:string, appendBlock ) =>
  {
    if ( !collectionBlock.block.inputs[inputName] )
    {
      collectionBlock.block.inputs[inputName] = appendBlock;
      return appendBlock;
    }
    else
    {
      let block = collectionBlock.block.inputs[inputName].block;
      while ( 1 )
      {
        if ( !block.next )
        {
          block.next = appendBlock;
          break;
        }
        block = block.next.block;
        return block;
      }
    }
  }

  const fetchTree = () => {
    setLoading( true );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {
        const tree = ret.data.tree;
        const parentId = tree.parentId;
        setHierarchy( tree.hierarchy );
        setObjects( tree.objects );
        const tmpQaObject = tree.objects.find( o => o.id === parentId );
        setQaObject( tmpQaObject );

        const blocks = restore_Blocks();
        const blockChildren = blocks.blocks.blocks;
        if ( tmpQaObject.typeId === EXPERIMENT )
        {
          const e = tree.objects.find( o => o.id === tmpQaObject.id );
          const experiment = restore_Object( null, e );
          blockChildren.push( experiment );

          ///////////////////////////////////////////////////
          /// SERVER
          const serverChildrenId = tmpQaObject.parent.find( h => h.parentId === tmpQaObject.id && h.childrenObjectTypeId === SERVER );
          if ( serverChildrenId )
          {
            const server = tree.objects.find( s => s.id === serverChildrenId.childrenId );
            experiment.inputs['SERVER'] = restore_Object( e, server );
          }

          ///////////////////////////////////////////////////
          /// COLLECTION
          const collectionChildrenIds = tmpQaObject.parent.filter( p => p.childrenId && p.childrenObjectTypeId === COLLECTION );
          if ( collectionChildrenIds.length > 0 )
          {
            experiment.inputs['COLLECTIONS'] = null;
            collectionChildrenIds.map( c => {
              const collection = tree.objects.find( o => o.id === c.childrenId );
              let collectionBlock = null;
              if ( !experiment.inputs['COLLECTIONS'] )
              {
                collectionBlock = restore_Object( e, collection );
                experiment.inputs['COLLECTIONS'] = collectionBlock;
              }
              else
              {
                let block = experiment.inputs['COLLECTIONS'].block;
                while ( 1 )
                {
                  if ( !block.next )
                  {
                    collectionBlock = restore_Object( e, collection );
                    block.next = collectionBlock;
                    break;
                  }
                  block = block.next.block;
                }
              }
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
                      caseBlock.block.inputs['BODY'] = restore_Object( cAse, body );
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


        Blockly.serialization.workspaces.load(blocks, workspace);

        setLoading( false );
      });
  }

  const [firstBlock, setFirstBlock] = useState( null );
  const [block, setBlock] = useState( null );
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
    // setWorkspace( tmpWorkspace );

    // const tmpFirstBlock = restore_Blocks();
    // setFirstBlock( tmpFirstBlock );
    // const tmpBlock = tmpFirstBlock.blocks.blocks;
    // setBlock( tmpBlock );

    // const firstBlock = restore_Blocks();
    // block = firstBlock.blocks.blocks;
    // Blockly.serialization.workspaces.load(firstBlock, workspace);
    fetchTree();


    setLoading( true );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {
        const tree = ret.data.tree;
        const parentId = tree.parentId;
        setHierarchy( tree.hierarchy );
        setObjects( tree.objects );
        const tmpQaObject = tree.objects.find( o => o.id === parentId );
        setQaObject( tmpQaObject );
        setLoading(false);
      });
  }, [] );

  const BlocklyElement = ( { qaObject, hierarchy, objects } ) =>
  {

    const children = qaObject.parent.map( m => m ).sort( (a, b) => a.childrenObjectTypeId - b.childrenObjectTypeId );
    return (
      <>
        <div key={`parent${qaObject.id}`}>
          {
            qaObject.name
          }
          {block && (() => {
            switch(qaObject.typeId) {
              case EXPERIMENT:
                // const o = restore_Object( null, qaObject );
                // block.push( o );
                // setExperiment( o );
                break;
              case SERVER:
                // const server = restore_Object( 1, qaObject );

                // firstBlock.blocks.blocks.push( server );
                // console.log( JSON.stringify( firstBlock ) );
                // experiment.inputs['SERVER'] = restore_Object( qaObject );
                // const workspaceJSon = restore_Server( qaObject.name, qaObject.address, qaObject.method, qaObject.header );

                break;

            }
            // Blockly.serialization.workspaces.load(firstBlock, workspace);
          })()}
        </div>

        {
          children.map( h => {
            const childObject = objects.find( o => o.id === h.childrenId );
            return (
              childObject &&
              <div key={`children${h.id}`} style={{marginLeft:'20px', marginTop: '10px'}}>
                <BlocklyElement qaObject={childObject} objects={objects} hierarchy={hierarchy} />
              </div>
            )
          } )
        }
      </>
    )
  }

  return qaObject &&
    <div style={{marginLeft:'40px'}}>
      <BlocklyElement qaObject={ qaObject } hierarchy={ hierarchy } objects={ objects } />
    </div>
}

export default BlocklyTree
