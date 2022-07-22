import { MetaTags } from '@redwoodjs/web'
import TreeNew from "src/components/TreeNew/TreeNew";

const TreePage = ( { id }) => {
  return (
    <>
      <MetaTags title="Tree" description="Tree page" />

      <TreeNew id={id} />
    </>
  )
}

export default TreePage
