import QaObjectRelationshipCell from 'src/components/QaObjectRelationship/QaObjectRelationshipCell'

type QaObjectRelationshipPageProps = {
  id: number
}

const QaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {
  return <QaObjectRelationshipCell id={id} />
}

export default QaObjectRelationshipPage
