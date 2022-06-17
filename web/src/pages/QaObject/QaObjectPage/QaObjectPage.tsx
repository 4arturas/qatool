import QaObjectCell from 'src/components/QaObject/QaObjectCell'

type QaObjectPageProps = {
  id: number
}

const QaObjectPage = ({ id }: QaObjectPageProps) => {
  return <QaObjectCell id={id} />
}

export default QaObjectPage
