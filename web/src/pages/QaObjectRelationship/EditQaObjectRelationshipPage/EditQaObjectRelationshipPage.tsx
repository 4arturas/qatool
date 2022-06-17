import EditQaObjectRelationshipCell from 'src/components/QaObjectRelationship/EditQaObjectRelationshipCell'

type QaObjectRelationshipPageProps = {
  id: number
}

const EditQaObjectRelationshipPage = ({ id }: QaObjectRelationshipPageProps) => {
  return <EditQaObjectRelationshipCell id={id} />
}

export default EditQaObjectRelationshipPage
