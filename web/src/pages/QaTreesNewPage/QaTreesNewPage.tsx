import { MetaTags } from '@redwoodjs/web'

type QaTreesNewPageProps = {
  typeId: string
}

const QaTreesNewPage = ({ typeId }: QaTreesNewPageProps) => {

  return (
    <>
      <MetaTags title="QaTreesNew" description="QaTreesNew page" />

      {/*<NewQaObject typeId={typeId}/>*/}
    </>
  )
}

export default QaTreesNewPage
