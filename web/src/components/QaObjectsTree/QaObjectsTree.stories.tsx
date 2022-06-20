import QaObjectsTree from './QaObjectsTree'
import {COLLECTION, SERVER} from "src/global";

export const generated = () => {
  return <>
  <div><QaObjectsTree typeId={SERVER}/></div>
  <div><QaObjectsTree typeId={COLLECTION}/></div>
  </>

}

export default { title: 'Components/QaObjectsTree' }
