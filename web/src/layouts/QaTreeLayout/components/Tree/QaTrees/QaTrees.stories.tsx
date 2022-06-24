import {COLLECTION, SERVER} from "src/global";
import QaTrees from "src/layouts/QaTreeLayout/components/Tree/QaTrees/QaTrees";

export const generated = () => {
  return <>
    <div><QaTrees typeId={SERVER}/></div>
    <div><QaTrees typeId={COLLECTION}/></div>
  </>
}

export default { title: 'Components/QaTrees' }
