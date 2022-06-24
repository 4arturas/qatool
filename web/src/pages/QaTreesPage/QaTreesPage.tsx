import { MetaTags } from '@redwoodjs/web'
import QaObjectsCell from "src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectsCell";
import QaObjectRelationshipsCell from "src/layouts/QaObjectRelationshipLayout/pages/components/Relationship/QaObjectRelationshipsCell";

const QaTreesPage = () => {
  return (
    <>
      <MetaTags title="QaTrees" description="QaTrees page" />

      <QaObjectsCell />
    </>
  )
}

export default QaTreesPage
