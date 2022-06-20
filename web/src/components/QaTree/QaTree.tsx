import {objectTypeToName} from "src/global";

const QaTree = ({typeId}) => {
  return (
    <>
      <h3 style={{display:'inline', marginRight:'20px'}}>{objectTypeToName(typeId)}</h3>
      {/*<Link to={routes.qaTreeNew(typeId)}>New</Link>*/}
      <a href={`/qa-tree/${typeId}/new`}>New</a>
    </>
  )
}

export default QaTree
