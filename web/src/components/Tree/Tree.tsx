import {CASE, EXPERIMENT, getChildrenTypeIdByParentTypeId, TEST, typeIdToColor, typeIdToName} from "src/global";
import {Tag, Tooltip} from "antd";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import Merge from "src/components/Merge/Merge";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectDetach from "src/components/ObjectDetach/ObjectDetach";

const Tree = ( { tree, relationId } ) => {

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

  const possibleToAddChildren: Array<number> =
    ( qaObject.typeId === EXPERIMENT || qaObject.typeId === CASE || qaObject.typeId === TEST ) ?
      qaObjectChildrenNew.filter( f => !availableChildrenForObject.includes( f.object.typeId  ) ).map( m => m.object.typeId )
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
    }
  }

  return <div id={`tree${parentId}`} style={stylingObject.treeComponent}>

    <Tag color={typeIdToColor(qaObject.typeId)} style={{color:'black'}}>
      {typeIdToName(qaObject.typeId)}
    </Tag>

    - {qaObject.name}

    <span key={`edit${parentId}`} style={stylingObject.editQaObject}>
      <ObjectEdit qaObject={qaObject} beforeSave={()=>{}} afterSave={()=>{}}/>
    </span>

    <span key={`clone${parentId}`} style={stylingObject.cloneQaObject}>
      <Tooltip title={'Clone object'}>
        <ObjectClone parentId={parentId} qaObject={qaObject} beforeSave={()=>{}} afterSave={()=>{}}/>
      </Tooltip>
    </span>

    <span key={`delete${parentId}`} style={stylingObject.deleteQaObject}>
      <Tooltip title={'Delete object'}>
        <ObjectDelete
          id={parentId}
          typeId={qaObject.typeId}
          beforeSave={()=>{}}
          afterSave={ () => {
            document.getElementById(`tree${parentId}`).style.display = 'none';
          }}
        />
      </Tooltip>
    </span>

    {
      qaObject.typeId !== EXPERIMENT &&
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
            return <span key={`tree${parentId}${typeId}`}><ObjectNew parentId={parentId} typeId={typeId} beforeSave={() => {
            }} afterSave={() => {
            }}/></span>
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

    <div key={`treeChildren${parentId}`} style={{marginLeft: '20px'}}>
      {
        qaObjectChildrenNew.map( q => {
        { return !q.object ?
          <span key={`dummyTreeChildrenInside${parentId}${ctx++}`}></span>/*TODO this needs to be solved, probably they are undefined because there are not deleted relationships*/ :
          <Tree key={`treeChildrenInside${q.object.id}`} tree={{ parentId: q.object.id, hierarchy: hierarchy, objects: objects }} relationId={q.relationId}/>
        }
      })}
    </div>

  </div>
}

export default Tree
