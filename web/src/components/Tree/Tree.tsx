import {
  CASE,
  DEFAULT_TABLE_PAGE_SIZE,
  EXPERIMENT,
  getChildrenTypeIdByParentTypeId,
  TEST,
  typeIdToColor,
  typeIdToName, typeIdToTag
} from "src/global";
import {Tag, Tooltip} from "antd";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import Merge from "src/components/Merge/Merge";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectDetach from "src/components/ObjectDetach/ObjectDetach";
import {routes} from "@redwoodjs/router";
import React from "react";
import {BarChartOutlined, ExperimentOutlined} from "@ant-design/icons";

const Tree = ( { tree, relationId, treeParentId/*id of parent*/  } ) => {

  let ctx = 0;

  const { parentId, hierarchy, objects }  = tree;
  const qaObject                          = objects.find( o => o.id === parentId );

  const childrenHierarchy:Array<{ id:number,parentId:number,childrenId:number}> =
    hierarchy.filter( h => h.parentId === parentId );

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

    - {qaObject.name}

    <span key={`edit${parentId}`} style={stylingObject.editQaObject}>
      <ObjectEdit
        qaObject={qaObject}
        beforeSave={()=>{}}
        afterSave={ () => {
          window.location.reload();
        }}/>
    </span>


    <span key={`clone${parentId}`} style={stylingObject.cloneQaObject}>
      <Tooltip title={'Clone object'}>
        <ObjectClone
          parentId={qaObject.typeId === EXPERIMENT ? null : treeParentId}
          qaObject={qaObject}
          beforeSave={() => {
          }}
          afterSave={(clonedObject, relationship) => {
            window.location.reload();
          }}
        />
      </Tooltip>
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
              <ObjectNew
                parentId={parentId}
                typeId={typeId}
                beforeSave={() => {}}
                afterSave={() => {
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
            qaObject.executed ?
              <Tooltip title={'View Experiment Results'}>
                <BarChartOutlined
                  style={ { fontSize:'20px', color: `${typeIdToColor(qaObject.typeId)}` } }
                  onClick={()=>{
                    alert( 'not implemented yet');
                  }}
                />
              </Tooltip>
              :
              <Tooltip title={'Run Experiment'}>
                <ExperimentOutlined
                  style={{fontSize:'19px', color: `${typeIdToColor(qaObject.typeId)}`}}
                  onClick={()=>{
                    alert( 'not implemented yet');
                  }}
                />
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
