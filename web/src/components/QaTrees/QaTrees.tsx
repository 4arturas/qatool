import {getChildrenTypeIdByParentTypeId} from "src/global";
import ObjectNew from "src/components/ObjectNew/ObjectNew";

const QaTrees = ({typeId}) => {
  const childTypeId: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
  return (
    <>
      <ObjectNew parentId={null} typeId={typeId} beforeSave={()=>{}} afterSave={()=>{}}/>
      {
        childTypeId.map( (childTypeId) =>
          <div key={`${childTypeId}div`} style={{marginLeft:'10px', marginBottom: '10px', marginTop: '10px', whiteSpace:'nowrap'}}>
            <QaTrees typeId={childTypeId}/>
          </div>
        )
      }
    </>
  )
}

export default QaTrees