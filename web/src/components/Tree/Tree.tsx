import {CASE, EXPERIMENT, getChildrenTypeIdByParentTypeId, TEST, typeIdToColor, typeIdToName} from "src/global";
import {Tag, Tooltip} from "antd";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import Merge from "src/components/Merge/Merge";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";

const Tree = ( { tree } ) => {

  const { parentId, hierarchy, objects }  = tree;
  const qaObject                          = objects.find( o => o.id === parentId );
  const children:Array<number>            = hierarchy.filter( h => h.parentId === parentId ).map( m => m.childrenId );
  const qaObjectChildren                  = objects.filter( o => children.includes( o.id ) );

  const availableChildrenForObject: Array<number> = getChildrenTypeIdByParentTypeId( qaObject.typeId );

  const possibleToAddChildren: Array<number> =
    ( qaObject.typeId === EXPERIMENT || qaObject.typeId === CASE || qaObject.typeId === TEST ) ?
      qaObjectChildren.filter( f => !availableChildrenForObject.includes( f.typeId  ) ).map( m => m.typeId )
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
      {qaObjectChildren.map( q => {
        return <Tree key={`treeChildrenInside${q.id}`} tree={{ parentId: q.id, hierarchy: hierarchy, objects: objects }}/>
      })}
    </div>

  </div>
}

export default Tree
