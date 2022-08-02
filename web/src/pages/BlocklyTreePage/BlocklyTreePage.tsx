import { MetaTags } from '@redwoodjs/web'
import BlocklyTree from "src/components/BlocklyTree/BlocklyTree";
import {useEffect} from "react";

const BlocklyTreePage = ( {id} ) => {

  useEffect( () => {

  }, [])

  return (
    <>
      <MetaTags title="BlocklyTree" description="BlocklyTree page" />

      <BlocklyTree id={id} />
    </>
  )
}

export default BlocklyTreePage
