import {getChildrenTypeIdByParentTypeId} from "src/global";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";

const QaTrees = ({typeId}) => {
  const childTypeId: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
  return (
    <>
      <ObjectNewTest typeId={typeId} qaObject={null} children={null} cloneObject={false} parentId={null} beforeSave={()=>{}} afterSave={()=>{}}/>
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
