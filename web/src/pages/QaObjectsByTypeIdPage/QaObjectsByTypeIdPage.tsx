import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import QaObjectsByTypeIdCell from 'src/components/QaObjectsByTypeIdCell'

type QaObjectsByTypeIdPageProps = {
  typeId: string
}

const QaObjectsByTypeIdPage = ({ typeId }: QaObjectsByTypeIdPageProps) => {
  return (
    <>
      <MetaTags title="QaObjectsByTypeId" description="QaObjectsByTypeId page" />

      <QaObjectsByTypeIdCell typeId={parseInt(typeId)}/>
    </>
  )
}

export default QaObjectsByTypeIdPage
