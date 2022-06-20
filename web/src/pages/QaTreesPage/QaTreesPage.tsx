import { MetaTags } from '@redwoodjs/web'
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
