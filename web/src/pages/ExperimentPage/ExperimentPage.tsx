import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ExperimentPage = ({id}) => {
  return (
    <>
      <MetaTags title="Experiment" description="Experiment page" />

      {id}

    </>
  )
}

export default ExperimentPage
