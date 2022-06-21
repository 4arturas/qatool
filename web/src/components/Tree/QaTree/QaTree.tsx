import {typeIdToName, typeIdToColor} from "src/global";
import {Link, routes} from "@redwoodjs/router";

const QaTree = ({typeId}) => {
  return (
    <div style={{marginBottom:'9px'}}>
      <div style={{display:'inline', marginRight:'10px'}}>
        <Link to={routes.qaObjectsByTypeId({typeId:typeId})} style={{backgroundColor: `${typeIdToColor(typeId)}`}} className='qaObjectTypeClass'>
          {typeIdToName(typeId)}
        </Link>
      </div>
      <Link to={routes.qaTreeNew({typeId:typeId})}>New</Link>
    </div>

  )
}

export default QaTree
