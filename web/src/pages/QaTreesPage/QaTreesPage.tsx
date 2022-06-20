import { MetaTags } from '@redwoodjs/web'
import QaObjectsCell from "src/components/QaObject/QaObjectsCell";
import QaObjectRelationshipsCell from "src/components/Relationship/QaObjectRelationshipsCell";

const QaTreesPage = () => {
  return (
    <>
      <MetaTags title="QaTrees" description="QaTrees page" />

      <QaObjectsCell />
    </>
  )
}

export default QaTreesPage
