import { MetaTags } from '@redwoodjs/web'
import TreeCell from "src/components/TreeCell";

const TreePage = ( { id }) => {
  return (
    <>
      <MetaTags title="Tree" description="Tree page" />

      <TreeCell id={id}/>
    </>
  )
}

export default TreePage
