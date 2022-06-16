import {Link, routes} from "@redwoodjs/router";

interface Props {
  qaObjectType : {
    id: number,
    name: string
  }
}

const QaObjectType = ({qaObjectType}: Props) => {
  return (
    <div>
      <h2>
        <Link to={routes.objectType({id:qaObjectType.id})}>
          {qaObjectType.name}
        </Link>
      </h2>
    </div>
  )
}

export default QaObjectType
