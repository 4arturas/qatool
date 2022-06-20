import {objectTypeToName} from "src/global";
import {Link, routes} from "@redwoodjs/router";

const QaTree = ({typeId}) => {
  return (
    <>
      <h3 style={{display:'inline', marginRight:'10px'}}>
        <a href={`/qa-trees/${typeId}`}>
          {objectTypeToName(typeId)}
        </a>
      </h3>
      {/*<Link to={routes.qaTreeNew(typeId)}>New</Link>*/}
      <a href={`/qa-trees/${typeId}/new`}>New</a>
    </>
  )
}

export default QaTree
