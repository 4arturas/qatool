import { MetaTags } from '@redwoodjs/web'
import ExperimentBrowserCell from "src/components/ExperimentBrowserCell";

const ExperimentBrowserPage = ( {id} ) => {
  return (
    <>
      <MetaTags title="ExperimentBrowser" description="ExperimentBrowser page" />

      <ExperimentBrowserCell id={id} />
    </>
  )
}

export default ExperimentBrowserPage
