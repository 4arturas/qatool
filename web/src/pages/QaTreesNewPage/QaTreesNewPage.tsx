import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import NewQaObject from "src/components/QaObject/NewQaObject/NewQaObject";

type QaTreesNewPageProps = {
  typeId: string
}

const QaTreesNewPage = ({ typeId }: QaTreesNewPageProps) => {

  return (
    <>
      <MetaTags title="QaTreesNew" description="QaTreesNew page" />

      <NewQaObject typeId={typeId}/>
    </>
  )
}

export default QaTreesNewPage
