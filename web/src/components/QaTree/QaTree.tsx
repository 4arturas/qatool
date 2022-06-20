import {objectTypeToName} from "src/global";

const QaTree = ({typeId}) => {
  return (
    <>
      <h3 style={{display:'inline', marginRight:'10px'}}>{objectTypeToName(typeId)}</h3>
      {/*<Link to={routes.qaTreeNew(typeId)}>New</Link>*/}
      <a href={`/qa-trees/${typeId}/new`}>New</a>
    </>
  )
}

export default QaTree
