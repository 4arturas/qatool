import { MetaTags } from '@redwoodjs/web'
import ExperimentCell from 'src/components/ExperimentCell'

const ExperimentPage = ({id}) => {
  return (
    <>
      <MetaTags title="Experiment" description="Experiment page" />

     <ExperimentCell id={id}/>

    </>
  )
}

export default ExperimentPage
