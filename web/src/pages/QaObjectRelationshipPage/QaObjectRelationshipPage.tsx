import { MetaTags } from '@redwoodjs/web'
import QaObjectRelationshipsCell from "src/components/Relationship/QaObjectRelationshipsCell";
import {useEffect} from "react";
import QaObjectRelationships from "src/components/Relationship/QaObjectRelationships/QaObjectRelationships";

type QaObjectRelationshipPageProps = {
  id: string
}

const QaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {

  return (
    <>
      <MetaTags title="QaObjectRelationship" description="QaObjectRelationship page" />

      <br/>

      <div key={'QaObjectRelationships'} style={{margin:'auto', maxWidth:'500px'}}>
        <QaObjectRelationships id={id} key={'ttt'}/>
      {/*<QaObjectRelationshipsCell parentId={id}/>*/}
      </div>
    </>
  )
}

export default QaObjectRelationshipPage
