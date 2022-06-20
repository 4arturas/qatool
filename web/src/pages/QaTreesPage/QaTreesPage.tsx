import { MetaTags } from '@redwoodjs/web'
import {COLLECTION, SERVER} from "src/global";
import QaTrees from "src/components/QaTrees/QaTrees";

const QaTreesPage = () => {
  return (
    <>
      <MetaTags title="QaTrees" description="QaTrees page" />

      <div><QaTrees typeId={SERVER}/></div>
      <div><QaTrees typeId={COLLECTION}/></div>
    </>
  )
}

export default QaTreesPage
