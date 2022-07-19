import {
  BODY,
  CASE, COLLECTION,
  DEFAULT_TABLE_PAGE_SIZE,
  EXPERIMENT,
  getChildrenTypeIdByParentTypeId, REMOVE, REPLACE, RESPONSE, RESULT, SERVER,
  TEST,
  typeIdToColor, typeIdToName,
  typeIdToTag
} from "src/global";
import {Popconfirm, Tooltip} from "antd";
import Merge from "src/components/Merge/Merge";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectDetach from "src/components/ObjectDetach/ObjectDetach";
import {navigate, routes} from "@redwoodjs/router";
import React, {useEffect, useState} from "react";
import {BarChartOutlined, ExperimentOutlined} from "@ant-design/icons";
import {useApolloClient} from "@apollo/client";
import {toast} from "@redwoodjs/web/toast";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";

export const FETCH_TREE = gql`
  query FetchTree($id: Int!) {
    tree: fetchHierarchy(id: $id) {
      parentId
      hierarchy {
        id
        parentId
        childrenId
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
        userId
        user { email }
        parent { id parentId childrenId childrenObjectTypeId }
      }
    }
  }
`

const Tree = ( { tree, relationId, treeParentId/*id of parent*/  } ) => {

  const client = useApolloClient();

  const [experimentIsRunning, setExperimentIsRunning] = useState( false );
  const [experimentIsExecuted, setExperimentIsExecuted] = useState( false );

  let ctx = 0;

  const [parentId, setParentId] = useState( null );
  const [hierarchy, setHierarchy] = useState( [] );
  const [objects, setObjects] = useState( [] );
  const [qaObject, setQaObject] = useState( [] );
  const setState = ( tree ) =>
  {
    setParentId( tree.parentId );
    setHierarchy( tree.hierarchy );
    setObjects( tree.objects );
    setQaObject( tree.objects.find( o => o.id === tree.parentId ) );
  }

  let childrenHierarchy:Array<{ id:number,parentId:number,childrenId:number}> =
    Array.from( new Set ( /*Unique*/
      hierarchy.filter( h => h.parentId === parentId )
    ) );

  const qaObjectChildrenNew = childrenHierarchy.map( ch => {
    return { relationId: ch.id, object: objects.find( o => o.id === ch.childrenId ) }
  })
  .sort( ( a, b ) => { return ((a.object ? a.object.typeId : -1) -(b.object ? b.object.typeId : -1)) } );

  useEffect( () => {
    setState( tree );
  }, [] );

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
      findAndAdd( arrRet, COLLECTION, qaObject );
    }
    else if ( qaObject.typeId === CASE )
    {
      findAndAdd( arrRet, BODY, qaObject );
      findAndAdd( arrRet, TEST, qaObject );
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

  const possibleToAddChildren: Array<number> = returnNonExisting( qaObject );

  const stylingObject = {
    treeComponent: {
      marginBottom: '10px', marginTop: '10px'
    },
    editQaObject: {
      marginLeft: '10px'
    },
    cloneQaObject: {
      marginLeft: '10px'
    },
    deleteQaObject: {
      marginLeft: '10px'
    },
    detachQaObject: {
      marginLeft: '5px'
    },
    addChildrenBlock: {
      border: `1px solid ${typeIdToColor(qaObject.typeId)}`, padding: '5px 0 5px 7px', borderRadius: '5px', marginLeft: '10px'
    },
    addChildrenTitle: {
      marginRight: '10px'
    },
    merge: {
      marginLeft: '10px'
    },
    runExperiment: {
      marginLeft: '8px'
    }
  }

  const refreshTree = ( id ) =>
  {
    client.query({
      query: FETCH_TREE,
      variables: { id: id }
    }).then( ret => {
      setState( ret.data.tree );
    });
  }

  const divTreeFragment = 'tree'

  return <div id={`${divTreeFragment}${parentId}`} style={stylingObject.treeComponent}>

    <a href={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0, typeId:`${qaObject.typeId}`} )}>
      {typeIdToTag(qaObject.typeId)}
    </a>

    - {qaObject.name}

    <span key={`edit${parentId}`} style={stylingObject.editQaObject}>
      <ObjectNewTest
        typeId={qaObject.typeId}
        qaObject={qaObject}
        children={childrenHierarchy.map( ch => objects.find( o => o.id == ch.childrenId ) )}
        cloneObject={false}
        parentId={null}
        beforeSave={()=>{}}
        afterSave={ ( updatedQaObject ) => {
          refreshTree( updatedQaObject.id );
        }}/>
    </span>
    <span key={`clone${parentId}`} style={stylingObject.editQaObject}>
      <ObjectNewTest
        typeId={qaObject.typeId}
        qaObject={qaObject}
        children={childrenHierarchy.map( ch => objects.find( o => o.id == ch.childrenId ) )}
        cloneObject={true}
        parentId={null}
        beforeSave={()=>{}}
        afterSave={ ( newQaObject ) => {
          // refreshTree( parentId );
        }}/>
    </span>

    <span key={`delete${parentId}`} style={stylingObject.deleteQaObject}>
      <Tooltip title={'Delete object'}>
        <ObjectDelete
          id={qaObject.id}
          typeId={qaObject.typeId}
          beforeSave={()=>{}}
          afterSave={ () => {
            if ( treeParentId === parentId )
            {
              navigate(  routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0} ) );
              return;
            }
            document.getElementById(`tree${parentId}`).style.display = 'none';
            // refreshTree( treeParentId );
          }}
        />
      </Tooltip>
    </span>

    {
      treeParentId !== parentId/*if here is equality that means that we are on the top of the hierarchy*/ &&
      <span key={`detach${parentId}`} style={stylingObject.detachQaObject}>
      <Tooltip title={'Delete object'}>
        <ObjectDetach
          relationId={relationId}
          qaObject={qaObject}
          beforeSave={()=>{}}
          afterSave={ () => {
            document.getElementById(`tree${parentId}`).style.display = 'none';
          }}
        />
      </Tooltip>
    </span>
    }

    {
      possibleToAddChildren.length > 0 &&
      <span key={`addChildrenBlock${parentId}`} style={stylingObject.addChildrenBlock}>
        <span key={`addChildrenTitle${parentId}`} style={stylingObject.addChildrenTitle}>Add children</span>
        {
          possibleToAddChildren.map((typeId:number) => {
            return <span key={`tree${parentId}${typeId}`}>
              <ObjectNewTest
                typeId={typeId}
                qaObject={null}
                children={childrenHierarchy.map( ch => objects.find( o => o.id == ch.childrenId ) )}
                cloneObject={false}
                parentId={parentId}
                beforeSave={()=>{}}
                afterSave={ (newQaObject) => {
                  refreshTree( parentId );
                  // window.location.reload();
                }}/>
            </span>
          })
        }
      </span>
    }

    {
      qaObject.typeId === CASE &&
      <span key={`merge${parentId}`} style={stylingObject.merge}>
        <Merge qaObjectParent={qaObject} />
      </span>
    }

    {
      qaObject.typeId === EXPERIMENT &&
      <span key={`runExperiment${parentId}`} style={stylingObject.runExperiment}>
          {
            (qaObject.executed||experimentIsExecuted) ?
              <Tooltip title={'View Experiment Results'}>
                <BarChartOutlined
                  style={ { fontSize:'20px', color: `${typeIdToColor(qaObject.typeId)}` } }
                  onClick={()=>{
                    navigate( routes.experiment({id:qaObject.id}))
                  }}
                />
              </Tooltip>
              :
              <Tooltip title={'Run Experiment'}>
                <Popconfirm
                  title="Are you sure you want to run this experiment?"
                  onConfirm={ async () => {
                    if ( experimentIsRunning ) return;
                    setExperimentIsRunning( true );

                    const runExperiment = async ( id:number ) =>
                    {
                      const RUN_EXPERIMENT = gql`
                        query RunExperiment($experimentId: Int!) {
                          runExperiment(experimentId: $experimentId) {
                            experimentId
                            error
                          }
                        }
                      `
                      const ret = await client.query({
                        query: RUN_EXPERIMENT,
                        variables: { experimentId: id }
                      });

                      const { experimentId, error } = ret.data.runExperiment;
                      return { experimentId, error };
                    };

                    setExperimentIsRunning( false );

                    const { experimentId, error } = await runExperiment( qaObject.id );
                    if ( error )
                    {
                      toast.error( error, { duration: 5000 } );
                      return;
                    }
                    toast.success( 'Experiment was executed successfully', { duration: 5000 } );
                    setExperimentIsExecuted( true );
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <ExperimentOutlined className={experimentIsRunning?'loading-spinner':''}
                    style={{fontSize:'19px', color: `${typeIdToColor(qaObject.typeId)}` }}
                  />
                </Popconfirm>

              </Tooltip>
          }
      </span>
    }

    <div key={`treeChildren${parentId}`} style={{marginLeft: '20px'}}>
      {
        qaObjectChildrenNew.map( q => {
        { return !q.object ?
          <span key={`dummyTreeChildrenInside${parentId}${ctx++}`}></span>/*TODO this needs to be solved, probably they are undefined because there are not deleted relationships*/ :
          <Tree
            key={`treeChildrenInside${q.object.id}`}
            tree={{ parentId: q.object.id, hierarchy: hierarchy, objects: objects }}
            relationId={q.relationId}
            treeParentId={parentId}
          />
        }
      })}
    </div>

  </div>
}

export default Tree
