import { MetaTags } from '@redwoodjs/web'
import QaObjectRelationshipsCell from "src/components/Relationship/QaObjectRelationshipsCell";
import {useEffect} from "react";

type QaObjectRelationshipPageProps = {
  id: string
}

const QaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {

  async function test()
  {
    const serverTime = await fetch('/.redwood/functions/serverTime');
    console.log((await serverTime.json()).data);
    // console.log(await serverTime.text());
  }


  return (
    <>
      <MetaTags title="QaObjectRelationship" description="QaObjectRelationship page" />

      <button onClick={test}>Button</button>

      <br/>
      <div style={{margin:'auto', maxWidth:'500px'}}>
      <QaObjectRelationshipsCell parentId={id}/>
      </div>
    </>
  )
}

export default QaObjectRelationshipPage
