import ObjectNew from "src/components/ObjectNew/ObjectNew";

const QaTree = ({typeId}) => {
  return (
    <div style={{marginBottom:'9px'}}>

{/*        <Link to={routes.qaObjectsByTypeId({typeId:typeId})}>
          {typeIdTagMargin(typeId)}
        </Link>*/}
      <ObjectNew parentId={null} typeId={typeId} beforeSave={()=>{}} afterSave={()=>{}}/>
      {/*<Link to={routes.qaTreeNew({typeId:typeId})}>New</Link>*/}
    </div>

  )
}

export default QaTree
