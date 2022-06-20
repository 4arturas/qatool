import { MetaTags } from '@redwoodjs/web'
import {COLLECTION, SERVER} from "src/global";
import QaTrees from "src/components/QaTrees/QaTrees";
import QaObjectsCell from "src/components/QaObject/QaObjectsCell";

const QaTreesPage = () => {
  return (
    <>
      <MetaTags title="QaTrees" description="QaTrees page" />

      <QaObjectsCell />
    </>
  )
}

export default QaTreesPage
