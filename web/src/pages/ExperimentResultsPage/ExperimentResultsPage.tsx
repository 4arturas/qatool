import { MetaTags } from '@redwoodjs/web'
import ExperimentResultsCell from 'src/components/ExperimentResultsCell'

const ExperimentResultsPage = ( {page, pageSize, count } ) => {

  return (
    <>
      <MetaTags title="ExperimentResults" description="ExperimentResults page" />

      <ExperimentResultsCell page={page} pageSize={pageSize} count={count}/>
    </>
  )
}

export default ExperimentResultsPage
