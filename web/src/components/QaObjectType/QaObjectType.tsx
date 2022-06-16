interface Props {
  qaObjectType : {
    id: number,
    name: string
  }
}

const QaObjectType = ({qaObjectType}: Props) => {
  return (
    <div>
      <h2>{qaObjectType.name}</h2>
    </div>
  )
}

export default QaObjectType
