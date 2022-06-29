import {typeIdToName, typeIdToColor, typeIdTagMargin} from "src/global";
import {Link, routes} from "@redwoodjs/router";

const QaTree = ({typeId}) => {
  return (
    <div style={{marginBottom:'9px'}}>

        <Link to={routes.qaObjectsByTypeId({typeId:typeId})}>
          {typeIdTagMargin(typeId)}
        </Link>

      <Link to={routes.qaTreeNew({typeId:typeId})}>New</Link>
    </div>

  )
}

export default QaTree
