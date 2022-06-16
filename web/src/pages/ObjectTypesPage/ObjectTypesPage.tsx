import { MetaTags } from '@redwoodjs/web'
import QaObjectTypesCell from "src/components/QaObjectTypesCell";

const ObjectTypesPage = () => {
  return (
    <>
      <MetaTags title="ObjectTypes" description="ObjectTypes page" />

      <QaObjectTypesCell/>
    </>
  )
}

export default ObjectTypesPage
