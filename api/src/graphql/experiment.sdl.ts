export const schema = gql`

  type Experiment {
    experimentId: Int!
    relations: [Relations]
    objects: [QaObject]
  }

  type ExperimentResult {
    experimentId: Int!
    error: String
  }
  type ExperimentCaseResult {
    results: [ExperimentResult]
  }

  type Query {
    runExperiment(experimentId: Int, delay: Int): ExperimentResult @requireAuth
    findExperiment(id: Int): Experiment @requireAuth
  }
`
