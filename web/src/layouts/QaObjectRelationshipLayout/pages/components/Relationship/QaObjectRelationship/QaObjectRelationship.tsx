import {
  CASE,
  COLLECTION, EXPERIMENT,
  getChildrenTypeIdByParentTypeId,
  SERVER,
  TEST,
  typeIdToColor,
} from "src/global";
import React, {useState} from "react";
import {toast, Toaster} from "@redwoodjs/web/toast";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import {Tag} from "antd";
import Merge from "src/components/Merge/Merge";

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

        <Tag key={`edibBlock${qaObject.id}${qaObject.typeId}`} style={{padding: '1px', paddingBottom: '3px', paddingRight: '10px', marginBottom: '5px', borderRadius: '15px'}}>
          <ObjectEdit qaObject={qaObject} beforeSave={()=>{}} afterSave={()=>{}}/>&nbsp;&nbsp;&nbsp;
          <ObjectClone parentId={(qaObject.typeId===COLLECTION || qaObject.typeId===SERVER) ? null : qaObject.id} qaObject={qaObject} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>&nbsp;&nbsp;&nbsp;
          <ObjectDelete key={`delete${qaObject.id}`}
                        id={qaObject.id}
                        typeId={qaObject.typeId}
                        beforeSave={()=>{}}
                        afterSave={(id)=> {
                          document.getElementById(`edibBlock${qaObject.id}${qaObject.typeId}`).style.display = 'none';
                        }
                        }/>&nbsp;&nbsp;&nbsp;
          {
            childrenIdArr.map((tId: number, idx: number) => {

                if ( qaObject.typeId === EXPERIMENT ||  qaObject.typeId === CASE || qaObject.typeId === TEST )
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
          <span key={`${qaObject.id}${uniqueId++}`} style={{}}><Merge qaObjectParent={qaObject} /></span>
        </Tag>

        { qaObject.parentId && <span key={`${qaObject.id}${uniqueId++}`} id={qaObject.relationshipId} onClick={detachComponent} style={{cursor:'pointer'}}>Detach</span> }

        {qaObject.children.map( (c, idx) => <QaObjectRelationship key={uniqueId+idx} qaObject={c} uniqueId={(uniqueId++)*(idx++)}/> )}
      </Tag>
    </>
  )
}

export default QaObjectRelationship
