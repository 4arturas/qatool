import { MetaTags } from '@redwoodjs/web'
import TreeNew from "src/components/TreeNew/TreeNew";
import BlocklyTree from "src/components/BlocklyTree/BlocklyTree";
import React from "react";

const TreePage = ( { id }) => {
  return (
    <>
      <MetaTags title="Tree" description="Tree page" />

      <div id="ide" style={{width:'100%', height: '800px'}}></div>
      <BlocklyTree id={id}/>

      <TreeNew id={id} />
    </>
  )
}

export default TreePage
