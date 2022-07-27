import { MetaTags } from '@redwoodjs/web'
import ExperimentTestCell from 'src/components/ExperimentTestCell'

const ExperimentTestPage = ( {caseId, testId} ) => {
  return (
    <>
      <MetaTags title="ExperimentTest" description="ExperimentTest page" />

      <ExperimentTestCell caseId={caseId} testId={testId} />
    </>
  )
}

export default ExperimentTestPage
