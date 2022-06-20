import {getChildrenTypeIdByParentTypeId} from "src/global";
import QaTree from "src/components/QaTree/QaTree";

const QaTrees = ({typeId}) => {
  const childTypeId: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
  return (
    <>
      <QaTree typeId={typeId}/>
      {
        childTypeId.map( (childTypeId) =>
          <div key={`${childTypeId}div`} style={{marginLeft:'30px'}}>
            <QaTrees typeId={childTypeId}/>
          </div>
        )
      }
    </>
  )
}

export default QaTrees
