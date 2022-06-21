import { MetaTags } from '@redwoodjs/web'
import QaObjectRelationshipsCell from "src/components/Relationship/QaObjectRelationshipsCell";

type QaObjectRelationshipPageProps = {
  id: string
}

const QaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {
  return (
    <>
      <MetaTags title="QaObjectRelationship" description="QaObjectRelationship page" />



      <br/>
      <div style={{margin:'auto', maxWidth:'500px'}}>
      <QaObjectRelationshipsCell parentId={id}/>
      </div>
    </>
  )
}

export default QaObjectRelationshipPage
