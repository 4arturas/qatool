import {Link, routes} from "@redwoodjs/router";
import {getChildrenTypeIdByParentTypeId, typeIdToName} from "src/global";

const QaObjectById = ({qaObject}) => {
  const childTypeIdArr: Array<number> = getChildrenTypeIdByParentTypeId(qaObject.typeId);

  return (
    <>
      <h2 key={qaObject.id} style={{display:'inline', marginRight: '10px'}}>{qaObject.name}</h2>
      {
        childTypeIdArr.map((typeId) => <a key={`${typeId}`} href={`/relationship/${qaObject.id}/new/${typeId}/type`} style={{marginRight:'10px'}}>
          [New {typeIdToName(typeId)}]
        </a> )
      }

      <a key={`a${qaObject.id}`} href={`/qa-objects/${qaObject.id}/edit`}>Edit</a>
    </>
  )
}

export default QaObjectById
