import {
  CASE,
  COLLECTION,
  getChildrenTypeIdByParentTypeId,
  getRandomIntInclusive,
  SERVER,
  TEST,
  typeIdToColor,
  typeIdToName
} from "src/global";
import {Link, navigate, routes} from "@redwoodjs/router";
import React, {useState} from "react";
import ReactDOM from "react-dom";
import {toast, Toaster} from "@redwoodjs/web/toast";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import {Tag} from "antd";

const QaObjectRelationship = ({qaObject, uniqueId}) => {

  const detachComponent = async (e) =>
  {
    const a = e.target;

    const newText = 'Detaching...'
    const newTextDetached = 'Detached'
    if ( a.innerHTML === newText || a.in === newTextDetached )
      return;
    const oldText = 'Detach'

    a.innerHTML = newText;

    fetch(`/.redwood/functions/relationshipDetach?id=${qaObject.relationshipId}`)
      .then( async (response) => {
        const data = (await response.json()).data;
        toast.success(`"${qaObject.name}" was detached`)

        a.innerHTML = newTextDetached;
        setTimeout(() => {
          window.location.reload();
        }, 1000 );

      })
      .catch((reason => {
        a.innerHTML = oldText;
        toast.error(reason.message);
      }));
  }

  const childrenIdArr: Array<number> = getChildrenTypeIdByParentTypeId(qaObject.typeId);
  let ctx = 0;
  return (
    <>
      <Tag key={`${qaObject.id}${uniqueId++}`}
            style={{
              display: 'block',
              whiteSpace: 'nowrap',
              borderRadius: '15px',
              border: '1px solid black',
              padding: '5px',
              marginBottom: '5px',
              backgroundColor: `${typeIdToColor(qaObject.typeId)}`, color: 'black'
            }}

      >

        <strong key={`${qaObject.id}${uniqueId++}`} style={{marginRight: '10px'}}>{qaObject.name}</strong>

        <Tag key={`edibBlock${qaObject.id}${qaObject.typeId}`} style={{padding: '1px', paddingBottom: '3px', marginBottom: '5px', borderRadius: '15px'}}>
          <ObjectEdit qaObject={qaObject} beforeSave={()=>{}} afterSave={()=>{}}/>&nbsp;&nbsp;&nbsp;
          <ObjectClone parentId={(qaObject.typeId===COLLECTION || qaObject.typeId===SERVER) ? null : qaObject.id} qaObject={qaObject} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>&nbsp;&nbsp;&nbsp;
          <ObjectDelete key={`delete${qaObject.id}`}
                        id={qaObject.id}
                        beforeSave={()=>{}}
                        afterSave={(id)=> {
                          document.getElementById(`edibBlock${qaObject.id}${qaObject.typeId}`).style.display = 'none';
                        }
                        }/>&nbsp;&nbsp;&nbsp;
          {
            childrenIdArr.map((tId: number, idx: number) => {

                if ( qaObject.typeId === CASE || qaObject.typeId === TEST )
                {
                  const alreadyAddedThisTypeOfObject = qaObject.children.find((c) => c.typeId === tId);
                  if (alreadyAddedThisTypeOfObject)
                    return <span key={`${qaObject.id}${qaObject.typeId}${uniqueId++}${idx}${tId}`}></span>
                }

              return <span key={`${qaObject.id}${qaObject.typeId}${uniqueId++}${idx}${tId}`}>
                <ObjectNew typeId={tId} parentId={qaObject.id} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>
              </span>
              })
          }
        </Tag>

        { qaObject.parentId && <span key={`${qaObject.id}${uniqueId++}`} id={qaObject.relationshipId} onClick={detachComponent} style={{cursor:'pointer'}}>Detach</span> }

        {qaObject.typeId===CASE &&
          <span key={`${qaObject.id}${uniqueId++}`} style={{marginLeft:'10px'}}>
            <Link key={`${qaObject.id}${uniqueId++}`} to={routes.qaObjectMerge( {parentId: qaObject.id})} style={{textDecoration:'none', color:'black'}}>
              Merge
            </Link>
          </span>
        }


        {qaObject.children.map( (c, idx) => <QaObjectRelationship key={uniqueId+idx} qaObject={c} uniqueId={(uniqueId++)*(idx++)}/> )}
      </Tag>
    </>
  )
}

export default QaObjectRelationship
