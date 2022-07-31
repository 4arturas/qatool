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

const returnNonExisting = ( qaObject ): Array<number> => {
  const findAndAdd = ( arr:Array<number>, typeId:number, qaObject:any ) =>
  {
    if ( !qaObject.parent.find( p => p.childrenObjectTypeId === typeId ) )
      arr.push( typeId );
  }
  const arrRet: Array<number> = [];
  if ( qaObject.typeId === EXPERIMENT )
  {
    findAndAdd( arrRet, SERVER, qaObject );
    arrRet.push( COLLECTION );
  }
  else if ( qaObject.typeId === CASE )
  {
    findAndAdd( arrRet, BODY, qaObject );
    arrRet.push( TEST );
  }
  else if ( qaObject.typeId === TEST )
  {
    findAndAdd( arrRet, REPLACE, qaObject );
    findAndAdd( arrRet, RESPONSE, qaObject );
    findAndAdd( arrRet, REMOVE, qaObject );
    findAndAdd( arrRet, RESULT, qaObject );
  }
  else
  {
    arrRet.push( ...getChildrenTypeIdByParentTypeId( qaObject.typeId ) );
  }
  return arrRet;
}

const BlocklyTree = ( { id }) => {

  const client = useApolloClient();
  const { hasRole } = useAuth();

  let workspace;
  const [loading, setLoading] = useState( false );

  const [hierarchy, setHierarchy] = useState([]);
  const [objects, setObjects] = useState([]);
  const [qaObject, setQaObject] = useState( null );

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
          const experiment = restore_Object( e );
          blockChildren.push( experiment );

          ///////////////////////////////////////////////////
          /// SERVER
          const serverChildrenId = tmpQaObject.parent.find( h => h.parentId === tmpQaObject.id && h.childrenObjectTypeId === SERVER );
          if ( serverChildrenId )
          {
            const server = tree.objects.find( s => s.id === serverChildrenId.childrenId );
            experiment.inputs['SERVER'] = restore_Object( server );
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
                collectionBlock = restore_Object( collection );
                experiment.inputs['COLLECTIONS'] = collectionBlock;
              }
              else
              {
                let block = experiment.inputs['COLLECTIONS'].block;
                while ( 1 )
                {
                  if ( !block.next )
                  {
                    collectionBlock = restore_Object( collection );
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
                // collectionBlock.block.inputs['SUITES'] = null;
                suiteChildrenIds.map( s => {
                  const suite = tree.objects.find( o => o.id === s.childrenId );
                  let suiteBlock = null;
                  if ( !collectionBlock.block.inputs['SUITES'] )
                  {
                    suiteBlock = restore_Object( suite );
                    collectionBlock.block.inputs['SUITES'] = suiteBlock;
                  }
                  else
                  {
                    let block = collectionBlock.block.inputs['SUITES'].block;
                    while ( 1 )
                    {
                      if ( !block.next )
                      {
                        suiteBlock = restore_Object( suite );
                        block.next = suiteBlock;
                        break;
                      }
                      block = block.next.block;
                    }
                  } //
                  ///////////////////////////////////////////////////
                  /// CASE
                  const caseChildrenIds = suite.parent.filter( h => h.parentId === suite.id && h.childrenObjectTypeId === CASE );
                  if ( caseChildrenIds.length > 0 )
                  {
                    caseChildrenIds.map( c => {
                      const cAse = tree.objects.find( o => o.id === c.childrenId );
                      let caseBlock = null;
                      if ( !suiteBlock.block.inputs['CASES'] )
                      {
                        caseBlock = restore_Object( cAse );
                        suiteBlock.block.inputs['CASES'] = caseBlock;
                      }
                      else
                      {
                        let block = suiteBlock.block.inputs['CASES'].block;
                        while ( 1 )
                        {
                          if ( !block.next )
                          {
                            caseBlock = restore_Object( cAse );
                            block.next = caseBlock;
                            break;
                          }
                          block = block.next.block;
                        }
                      }

                      ///////////////////////////////////////////////////
                      /// BODY
                      const bodyChildren = cAse.parent.find( c => c.childrenObjectTypeId === BODY );
                      const body = tree.objects.find( b => b.id === bodyChildren.childrenId );
                      caseBlock.block.inputs['BODY'] = restore_Object( body );
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

                          if ( !caseBlock.block.inputs['TESTS'] )
                          {
                            caseBlock.block.inputs['TESTS'] = restore_Object( test );
                            caseBlock.block.inputs['TESTS'].block.inputs['REPLACE'] = restore_Object( replace );
                            caseBlock.block.inputs['TESTS'].block.inputs['REMOVE'] = restore_Object( remove );
                            caseBlock.block.inputs['TESTS'].block.inputs['RESULT'] = restore_Object( result );
                            caseBlock.block.inputs['TESTS'].block.inputs['RESPONSE'] = restore_Object( response );
                          }
                          else
                          {
                            let block = caseBlock.block.inputs['TESTS'].block;
                            while ( 1 )
                            {
                              if ( !block.next )
                              {
                                caseBlock = restore_Object( test );
                                caseBlock.block.inputs['REPLACE'] = restore_Object( replace );
                                caseBlock.block.inputs['REMOVE'] = restore_Object( remove );
                                caseBlock.block.inputs['RESULT'] = restore_Object( result );
                                caseBlock.block.inputs['RESPONSE'] = restore_Object( response );
                                block.next = caseBlock;
                                break;
                              }
                              block = block.next.block;
                            }
                          }
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

  useEffect( () => {
    Blockly.common.defineBlocksWithJsonArray(comp);
    workspace = ( Blockly.inject('ide', { toolbox: toolbox,   move: {
        scrollbars: {
          horizontal: true,
          vertical: true
        },
        drag: true,
        wheel: true} } ) );
    fetchTree();
  }, [] );

  const BlocklyElement = ( { qaObject, hierarchy, objects, relationId } ) =>
  {

    const children = qaObject.parent.map( m => m ).sort( (a, b) => a.childrenObjectTypeId - b.childrenObjectTypeId );

    const possibleToAddChildren: Array<number> = returnNonExisting( qaObject );

    return (
      <>
       {/* <div key={`parent${qaObject.id}`}>
          {
            qaObject.name
          }
          {workspace && (() => {
            switch(qaObject.typeId) {
              case SERVER:
                const workspaceJSon = restore_Server( qaObject.name, qaObject.address, qaObject.method, qaObject.header );
                Blockly.serialization.workspaces.load(workspaceJSon, workspace);
                break;
            }
          })()}
        </div>

        {
          children.map( h => {
            const childObject = objects.find( o => o.id === h.childrenId );
            return (
              childObject &&
              <div key={`children${h.id}`} style={{marginLeft:'20px', marginTop: '10px'}}>ba
                <BlocklyElement qaObject={childObject} objects={objects} hierarchy={hierarchy} relationId={h.id}/>
              </div>
            )
          } )
        }*/}
      </>
    )
  }

  return <></>/*qaObject &&
    <div style={{marginLeft:'40px'}}>bababa
      <BlocklyElement qaObject={ qaObject } hierarchy={ hierarchy } objects={ objects } relationId={null} />
    </div>*/
}

export default BlocklyTree
