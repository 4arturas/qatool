import { MetaTags } from '@redwoodjs/web'
import QaObjectRelationshipsCell from "src/components/Relationship/QaObjectRelationshipsCell";

type QaObjectRelationshipPageProps = {
  id: string
}

const QaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {
  return (
    <>
      <MetaTags title="QaObjectRelationship" description="QaObjectRelationship page" />

      <QaObjectRelationshipsCell parentId={id}/>
    </>
  )
}

export default QaObjectRelationshipPage
