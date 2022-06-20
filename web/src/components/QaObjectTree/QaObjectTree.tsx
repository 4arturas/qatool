import {objectTypeToName} from "src/global";

const QaObjectTree = ( {typeId} ) => {

  return (
      <h3>{objectTypeToName(typeId)}</h3>
  )
}

export default QaObjectTree
