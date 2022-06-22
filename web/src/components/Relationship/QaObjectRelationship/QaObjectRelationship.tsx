import {CASE, getChildrenTypeIdByParentTypeId, typeIdToColor, typeIdToName} from "src/global";
import {Link, routes} from "@redwoodjs/router";

const QaObjectRelationship = ({qaObject, uniqueId}) => {

  const childrenIdArr: Array<number> = getChildrenTypeIdByParentTypeId(qaObject.typeId);
  let ctx = 1;

  return (
    <>
      <div key={`${qaObject.id}${uniqueId++}`}
            style={{
              whiteSpace: 'nowrap',
              borderRadius: '15px',
              border: '1px solid black',
              padding: '5px',
              marginBottom: '5px',
              backgroundColor: `${typeIdToColor(qaObject.typeId)}`
            }}>

        <strong key={`${qaObject.id}${uniqueId++}`} style={{marginRight: '10px'}}>{qaObject.name}</strong>

        <Link key={`${qaObject.id}${uniqueId++}`} to={routes.editQaObject({id: qaObject.id})} style={{marginRight: '10px'}}>
          Edit
        </Link>

        { qaObject.parentId && <a key={`${qaObject.id}${uniqueId++}`}>Detach</a> }

        {qaObject.typeId===CASE &&
          <span key={`${qaObject.id}${uniqueId++}`} style={{marginLeft:'10px'}}>
            <Link key={`${qaObject.id}${uniqueId++}`} to={routes.qaObjectMerge( {parentId: qaObject.id})}>
              Merge
            </Link>
          </span>
        }

        {childrenIdArr.length > 0 &&
          childrenIdArr.map((tId: number, idx: number) => {
            const alreadyAddedThisTypeOfObject = qaObject.children.find( (c) => c.typeId === tId );
            if ( alreadyAddedThisTypeOfObject ) return <></>

            return <Link key={`${qaObject.id}${uniqueId++}${idx}`} to={routes.qaObjectRelationshipNew({parentId: qaObject.id, typeId: tId})} style={{marginLeft: '10px', marginRight: '10px'}}>
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
