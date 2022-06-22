import {useEffect, useState} from "react";
import QaObjectRelationship from "src/components/Relationship/QaObjectRelationship/QaObjectRelationship";

const QaObjectRelationships = ({id}) => {

  const [tree, setTree] = useState(null);

  useEffect(() => {
    async function fetchTree()
    {
      const serverTime = await fetch(`/.redwood/functions/relationshipTree?id=${id}`);
      setTree((await serverTime.json()).data);
    }
    fetchTree();
  },[]);

  return (
    <>
        { tree ? <QaObjectRelationship key={'QaObjectRelationship'} qaObject={tree} uniqueId={0}/> : <span key={'loading'}>Loading</span> }
    </>
  )
}

export default QaObjectRelationships
