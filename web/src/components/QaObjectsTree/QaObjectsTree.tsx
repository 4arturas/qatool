import {getChildrenTypeIdByParentTypeId, objectTypeToName} from "src/global";
import QaObjectTree from "src/components/QaObjectTree/QaObjectTree";

const QaObjectsTree = ({typeId}) => {
  const childTypeId: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
  return (
    <>
      <QaObjectTree typeId={typeId}/>
      {
        childTypeId.map( (childTypeId) =>
          <div style={{marginLeft:'30px'}}>
            <QaObjectsTree typeId={childTypeId}/>
          </div>
        )
      }
    </>
  )
}

export default QaObjectsTree
