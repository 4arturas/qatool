import {
  CASE,
  DEFAULT_TABLE_PAGE_SIZE,
  EXPERIMENT,
  getChildrenTypeIdByParentTypeId,
  TEST,
  typeIdToColor, typeIdToName,
  typeIdToTag
} from "src/global";
import {Popconfirm, Tooltip} from "antd";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import Merge from "src/components/Merge/Merge";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectDetach from "src/components/ObjectDetach/ObjectDetach";
import {navigate, routes} from "@redwoodjs/router";
import React, {useState} from "react";
import {BarChartOutlined, ExperimentOutlined} from "@ant-design/icons";
import {useApolloClient} from "@apollo/client";
import {toast} from "@redwoodjs/web/toast";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";

const Tree = ( { tree, relationId, treeParentId/*id of parent*/  } ) => {

  const client = useApolloClient();

  const [experimentIsRunning, setExperimentIsRunning] = useState( false );
  const [experimentIsExecuted, setExperimentIsExecuted] = useState( false );

  let ctx = 0;

  let { parentId, hierarchy, objects }  = tree;
  const qaObject                          = objects.find( o => o.id === parentId );

  let childrenHierarchy:Array<{ id:number,parentId:number,childrenId:number}> =
    Array.from( new Set ( /*Unique*/
      hierarchy.filter( h => h.parentId === parentId )
    ) );

  const qaObjectChildrenNew = childrenHierarchy.map( ch => {
    return { relationId: ch.id, object: objects.find( o => o.id === ch.childrenId ) }
  });

  const availableChildrenForObject: Array<number> =
    getChildrenTypeIdByParentTypeId( qaObject.typeId );

  const returnNonExisting = ( arrChildren:Array<number>, arrObjects ): Array<number> => {
    const arrRet: Array<number> = [];
    for ( let i = 0; i < arrChildren.length; i++ ) {
      const typeId = arrChildren[i];
      let exists: boolean = false;
      for (let j = 0; j < arrObjects.length; j++) {
        const object = arrObjects[j];
        if ( object.object.typeId === typeId )
        {
          exists = true;
          break;
        } // end if
      } // end for j
      if ( !exists )
        arrRet.push( typeId );
    } // end for i
    return arrRet;
  }

  const possibleToAddChildren: Array<number> =
    ( (qaObject.typeId === EXPERIMENT || qaObject.typeId === CASE || qaObject.typeId === TEST) ) ?
      returnNonExisting( availableChildrenForObject, qaObjectChildrenNew )
      :
      getChildrenTypeIdByParentTypeId( qaObject.typeId );

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

  const divTreeFragment = 'tree'

  return <div id={`${divTreeFragment}${parentId}`} style={stylingObject.treeComponent}>

    <a href={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0, typeId:`${qaObject.typeId}`} )}>
      {typeIdToTag(qaObject.typeId)}
    </a>

    - {qaObject.name} (OWNER of the object <b>{qaObject.user.email}</b>) (Has <b>{qaObject.parent.length}</b> children) (Children type <b>{qaObject.parent.map( p => `${typeIdToName(p.childrenObjectTypeId)} - ` )}</b> children)

    <span key={`edit${parentId}`} style={stylingObject.editQaObject}>
      <ObjectNewTest
        typeId={qaObject.typeId}
        qaObject={qaObject}
        children={childrenHierarchy.map( ch => objects.find( o => o.id == ch.childrenId ) )}
        cloneObject={false}
        parentId={null}
        beforeSave={()=>{}}
        afterSave={ () => {
          window.location.reload();
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
        afterSave={ () => {
          window.location.reload();
        }}/>
    </span>

    <span key={`delete${parentId}`} style={stylingObject.deleteQaObject}>
      <Tooltip title={'Delete object'}>
        <ObjectDelete
          id={qaObject.id}
          typeId={qaObject.typeId}
          beforeSave={()=>{}}
          afterSave={ () => {
            document.getElementById(`tree${parentId}`).style.display = 'none';
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
                afterSave={ () => {
                  window.location.reload();
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
