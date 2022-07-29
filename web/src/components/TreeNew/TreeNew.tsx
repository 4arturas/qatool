import {useApolloClient} from "@apollo/client";
import {useAuth} from "@redwoodjs/auth";
import React, {useEffect, useState} from "react";
import {Popconfirm, Tag, Tooltip} from "antd";
import {
  BODY,
  CASE,
  COLLECTION,
  DEFAULT_TABLE_PAGE_SIZE,
  EXPERIMENT, getChildrenTypeIdByParentTypeId, REMOVE, REPLACE, RESPONSE, RESULT, ROLE_ADMIN,
  SERVER, TEST,
  typeIdToColor,
  typeIdToName
} from "src/global";
import {navigate, routes} from "@redwoodjs/router";
import Help from "src/components/Help/Help";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectDetach from "src/components/ObjectDetach/ObjectDetach";
import Merge from "src/components/Merge/Merge";
import {BarChartOutlined, ExperimentOutlined} from "@ant-design/icons";
import {toast} from "@redwoodjs/web/toast";
import ObjectDeepClone from "src/components/ObjectDeepClone/ObjectDeepClone";
import ObjectView from "src/components/ObjectView/ObjectView";

export const QUERY = gql`
  query FindTreeQueryNew($id: Int!) {
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

const TreeNew = ( { id }) => {
  const client = useApolloClient();
  const { hasRole } = useAuth();

  const STATE_INIT = 'Init';
  const STATE_LOADING = 'Loading...';
  const STATE_EXPERIMENT_IS_RUNNING = 'Experiment is running...';
  const [state, setState] = useState(STATE_INIT);

  const [hierarchy, setHierarchy] = useState([]);
  const [objects, setObjects] = useState([]);
  const [qaObject, setQaObject] = useState( null );

  const fetchTree = () => {
    setState( STATE_LOADING );
    client
      .query( { query: QUERY, variables: { id: id } } )
      .then( ret => {
        const tree = ret.data.tree;
        const parentId = tree.parentId;
        setHierarchy( tree.hierarchy );
        setObjects( tree.objects );
        setQaObject( tree.objects.find( o => o.id === parentId ) );
        setState( STATE_INIT );
      });
  }

  const Tree = ( { qaObject, hierarchy, objects, relationId, parentId } ) =>
  {

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
      deepClone: {
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

    const children = qaObject.parent.map( m => m ).sort( (a, b) => a.childrenObjectTypeId - b.childrenObjectTypeId );

    const possibleToAddChildren: Array<number> = returnNonExisting( qaObject );

    return (
      <>
        <div key={`parent${qaObject.id}`}>
          <Tag color={typeIdToColor(qaObject.typeId)}>
            <a href={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0, typeId:`${qaObject.typeId}`} )} style={{color:'black'}}>
              {typeIdToName(qaObject.typeId)}
            </a>
            <Help anchor={`anchorObjects${qaObject.typeId}`}/>
          </Tag>

          - {qaObject.name}&nbsp;&nbsp;&nbsp;<ObjectView qaObject={qaObject} />

          {
            (hasRole([ROLE_ADMIN]) && qaObject.typeId === EXPERIMENT && !qaObject.executed) &&
            <span key={`runExperiment${qaObject.id}`} style={stylingObject.runExperiment}>
              <Tooltip title={'Run Experiment'}>
                <Popconfirm
                  title="Are you sure you want to run this experiment?"
                  onConfirm={ () => {
                    if ( state === STATE_EXPERIMENT_IS_RUNNING ) return;
                    setState( STATE_EXPERIMENT_IS_RUNNING );

                    new Promise( async (resolve, reject) => {
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

                      const { experimentId, error } = await runExperiment( qaObject.id );
                      if ( error )
                      {
                        setState( STATE_INIT );
                        toast.error( error );
                        return;
                      }
                      toast.success( 'Experiment was executed successfully' );
                      setState( STATE_INIT );
                      fetchTree();
                    })

                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <ExperimentOutlined
                    className={state===STATE_EXPERIMENT_IS_RUNNING?'loading-spinner':''}
                    style={{fontSize:'19px', color: `${typeIdToColor(qaObject.typeId)}` }}
                  />
                </Popconfirm>
              </Tooltip>
            </span>
          }

          {
            ( (qaObject.typeId === EXPERIMENT || qaObject.typeId === TEST) && qaObject.executed ) &&
            <Tooltip title={'View Experiment Results'}>
              <BarChartOutlined
                style={ { marginLeft: '10px', fontSize:'20px', color: `${typeIdToColor(qaObject.typeId)}` } }
                onClick={()=>{
                  if ( qaObject.typeId === EXPERIMENT )
                    navigate( routes.experiment({id:qaObject.id}))
                  else
                    navigate( routes.experimentTest({caseId:parentId, testId: qaObject.id}))
                }}
              />
            </Tooltip>
          }

          {hasRole([ROLE_ADMIN]) && <>
            {
              (state === STATE_LOADING || state === STATE_EXPERIMENT_IS_RUNNING) ? <span style={{marginLeft: '10px', padding: '5px'}}>{state}</span> :
                <>
                  {
                    (!qaObject.executed) &&
                    <span key={`edit${qaObject.id}`} style={stylingObject.editQaObject}>
                      <ObjectNewTest
                        typeId={qaObject.typeId}
                        qaObject={qaObject}
                        children={children.map(ch => objects.find(o => o.id == ch.childrenId))}
                        cloneObject={false}
                        parentId={null}
                        beforeSave={() => {
                        }}
                        afterSave={(updatedQaObject) => {
                          fetchTree();
                        }}/>
                    </span>
                  }
                  {
                    (!qaObject.executed) &&
                    <span key={`clone${qaObject.id}`} style={stylingObject.editQaObject}>
                      <ObjectNewTest
                        typeId={qaObject.typeId}
                        qaObject={qaObject}
                        children={children.map(ch => objects.find(o => o.id == ch.childrenId))}
                        cloneObject={true}
                        parentId={null}
                        beforeSave={() => {
                        }}
                        afterSave={(newQaObject) => {
                          fetchTree();
                        }}/>
                    </span>
                  }
                  <span key={`deepClone${qaObject.id}`} style={stylingObject.deepClone}>
                    <ObjectDeepClone
                      qaObject={qaObject}
                      beforeSave={() => { }}
                      afterSave={(newQaObject) => {}}
                    />
                  </span>

                  {
                    (!qaObject.executed) &&
                    <span key={`delete${qaObject.id}`} style={stylingObject.deleteQaObject}>
                      <Tooltip title={'Delete object'}>
                        <ObjectDelete
                          id={qaObject.id}
                          typeId={qaObject.typeId}
                          beforeSave={() => {
                          }}
                          afterSave={() => {
                            fetchTree();
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  {
                    (qaObject.typeId !== EXPERIMENT && !qaObject.executed) &&
                    <span key={`detach${qaObject.id}`} style={stylingObject.detachQaObject}>
                      <Tooltip title={'Delete object'}>
                        <ObjectDetach
                          relationId={relationId}
                          qaObject={qaObject}
                          beforeSave={() => {
                          }}
                          afterSave={() => {
                            fetchTree();
                          }}
                        />
                      </Tooltip>
                    </span>
                  }

                  <span style={{marginLeft:'7px'}}><Merge qaObject={qaObject}/></span>

                  {
                    (!qaObject.executed && possibleToAddChildren.length > 0) &&
                    <span key={`addChildrenBlock${qaObject.id}`} style={stylingObject.addChildrenBlock}>
                    <span key={`addChildrenTitle${qaObject.id}`} style={stylingObject.addChildrenTitle}>Add children</span>
                    {
                      possibleToAddChildren.map((typeId: number) => {
                        return (
                          <span key={`tree${qaObject.id}${typeId}`} style={{marginRight: '5px'}}>
                            <ObjectNewTest
                              typeId={typeId}
                              qaObject={null}
                              children={children.map(ch => objects.find(o => o.id == ch.childrenId))}
                              cloneObject={false}
                              parentId={qaObject.id}
                              beforeSave={() => {
                              }}
                              afterSave={(newQaObject) => {
                                fetchTree();
                              }}/>
                          </span>)
                      })
                    }
                    </span>
                  }

                </>
            /*loading*/}

            </>
          /*has role*/}
        </div>

        {
          children.map( h => {
            const childObject = objects.find( o => o.id === h.childrenId );
            return (
              childObject &&
              <div key={`children${h.id}`} style={{marginLeft:'20px', marginTop: '10px'}}>
                <Tree qaObject={childObject} objects={objects} hierarchy={hierarchy} relationId={h.id} parentId={qaObject.id}/>
              </div>
            )
          } )
        }
      </>
    );
  }

  useEffect( () => {
    fetchTree();
  }, [] );

  return qaObject &&
    <div style={{marginLeft:'40px'}}>
      <Tree qaObject={ qaObject } hierarchy={ hierarchy } objects={ objects } relationId={null} parentId={null}/>
    </div>

}

export default TreeNew
