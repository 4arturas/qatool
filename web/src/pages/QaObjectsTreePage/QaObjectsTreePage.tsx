import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import QaObjectsTree from "src/components/QaObjectsTree/QaObjectsTree";
import {COLLECTION, SERVER} from "src/global";

const QaObjectsTreePage = () => {
  return (
    <>
      <MetaTags title="QaObjectsTree" description="QaObjectsTree page" />

      <div><QaObjectsTree typeId={SERVER}/></div>
      <div><QaObjectsTree typeId={COLLECTION}/></div>

    </>
  )
}

export default QaObjectsTreePage
