import {CASE, getChildrenTypeIdByParentTypeId, TEST, typeIdToColor, typeIdToName} from "src/global";
import {Link, navigate, routes} from "@redwoodjs/router";
import {useState} from "react";
import ReactDOM from "react-dom";
import {toast, Toaster} from "@redwoodjs/web/toast";

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
        console.log(data);
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
      <div key={`${qaObject.id}${uniqueId++}`}
            style={{
              whiteSpace: 'nowrap',
              borderRadius: '15px',
              border: '1px solid black',
              padding: '5px',
              marginBottom: '5px',
              backgroundColor: `${typeIdToColor(qaObject.typeId)}`, color: 'black'
            }}

      >

        <strong key={`${qaObject.id}${uniqueId++}`} style={{marginRight: '10px'}}>{qaObject.name}</strong>

        <Link key={`${qaObject.id}${uniqueId++}`} to={routes.editQaObject({id: qaObject.id})} style={{marginRight: '10px', textDecoration: 'none', color: 'black'}}>
          Edit
        </Link>

        { qaObject.parentId && <span key={`${qaObject.id}${uniqueId++}`} id={qaObject.relationshipId} onClick={detachComponent} style={{cursor:'pointer'}}>Detach</span> }

        {qaObject.typeId===CASE &&
          <span key={`${qaObject.id}${uniqueId++}`} style={{marginLeft:'10px'}}>
            <Link key={`${qaObject.id}${uniqueId++}`} to={routes.qaObjectMerge( {parentId: qaObject.id})} style={{textDecoration:'none', color:'black'}}>
              Merge
            </Link>
          </span>
        }

        {childrenIdArr.map((tId: number, idx: number) => {

            if ( qaObject.typeId === CASE || qaObject.typeId === TEST )
            {
              const alreadyAddedThisTypeOfObject = qaObject.children.find((c) => c.typeId === tId);
              if (alreadyAddedThisTypeOfObject)
                return <></>
            }

            return <Link key={`${qaObject.id}${uniqueId++}${idx}`} to={routes.qaObjectRelationshipNew({parentId: qaObject.id, typeId: tId})} style={{marginLeft: '10px', textDecoration:'none', color:'black'}}>
                <span key={`${qaObject.id}${uniqueId++}${idx}`} style={{
                  backgroundColor: `${typeIdToColor(tId)}`,
                  border: '1px solid black',
                  padding: '3px',
                  borderRadius: '15px'
                }}>Add {typeIdToName(tId)}</span>
            </Link>
          })
        }
        {qaObject.children.map( (c, idx) => <QaObjectRelationship key={uniqueId+idx} qaObject={c} uniqueId={(uniqueId++)*(idx++)}/> )}
      </div>
    </>
  )
}

export default QaObjectRelationship
