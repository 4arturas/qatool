import { MetaTags } from '@redwoodjs/web'
import ExperimentTestCell from 'src/components/ExperimentTestCell'

const ExperimentTestPage = ( {testId} ) => {
  return (
    <>
      <MetaTags title="ExperimentTest" description="ExperimentTest page" />

      <ExperimentTestCell testId={testId} />
    </>
  )
}

export default ExperimentTestPage
