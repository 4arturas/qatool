import {objectTypeToName} from "src/global";

const QaTree = ({typeId}) => {
  return (
    <h3>{objectTypeToName(typeId)}</h3>
  )
}

export default QaTree
