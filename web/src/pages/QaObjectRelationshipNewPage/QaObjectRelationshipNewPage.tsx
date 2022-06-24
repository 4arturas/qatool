import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import NewQaObject from "src/layouts/QaObjectsLayout/pages/components/QaObject/NewQaObject";

type QaObjectRelationshipNewPageProps = {
  parentId: number,
  typeId: number
}

const QaObjectRelationshipNewPage = ({ parentId, typeId }: QaObjectRelationshipNewPageProps) => {
  return (
    <>
      <MetaTags title="QaObjectRelationshipNew" description="QaObjectRelationshipNew page" />

      <NewQaObject typeId={typeId} parentId={parentId}/>
    </>
  )
}

export default QaObjectRelationshipNewPage
