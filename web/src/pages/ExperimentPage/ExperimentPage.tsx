import { MetaTags } from '@redwoodjs/web'
import ExperimentCell from 'src/components/ExperimentCell'

const ExperimentPage = ({id, typeId}) => {
  return (
    <>
      <MetaTags title="Experiment" description="Experiment page" />

     <ExperimentCell id={id} typeId={typeId}/>

    </>
  )
}

export default ExperimentPage
