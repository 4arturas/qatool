import { MetaTags } from '@redwoodjs/web'
import QaObjectTypeCell from "src/components/QaObjectType/QaObjectTypeCell";

const ObjectTypePage = ( {id}) => {
  return (
    <>
      <MetaTags title="ObjectType" description="ObjectType page" />

      <QaObjectTypeCell id={id}/>
    </>
  )
}

export default ObjectTypePage
