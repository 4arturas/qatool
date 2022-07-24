import { MetaTags } from '@redwoodjs/web'
import TreeNew from "src/components/TreeNew/TreeNew";
import BlocklyComponent from "src/components/BlocklyComponent/BlocklyComponent";

const TreePage = ( { id }) => {
  return (
    <>
      <MetaTags title="Tree" description="Tree page" />
<BlocklyComponent/>
      <TreeNew id={id} />
    </>
  )
}

export default TreePage
