import EditQaObjectCell from 'src/components/QaObject/EditQaObjectCell'

type QaObjectPageProps = {
  id: number
}

const EditQaObjectPage = ({ id }: QaObjectPageProps) => {
  return <EditQaObjectCell id={id} />
}

export default EditQaObjectPage
