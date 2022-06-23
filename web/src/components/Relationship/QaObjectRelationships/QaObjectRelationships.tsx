import {useEffect, useState} from "react";
import QaObjectRelationship from "src/components/Relationship/QaObjectRelationship/QaObjectRelationship";
import {Toaster} from "@redwoodjs/web/toast";

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
        <Toaster toastOptions={{ className: 'rw-toast', duration: 3000 }} />
        { tree ? <QaObjectRelationship key={'QaObjectRelationship'} qaObject={tree} uniqueId={0}/> : <span key={'loading'}>Loading</span> }
    </>
  )
}

export default QaObjectRelationships
