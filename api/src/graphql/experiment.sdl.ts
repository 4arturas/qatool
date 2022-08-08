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

  type RunBrowserExperimentResult {
    testId: Int
    requestTime: Int
    thread: Int
    loop: Int

    type: Int
    paymentId: Int
    request: String
    response: String
    requestDate: String
    responseDate: String
    jsonata: String
    txnId: String
  }

  type Query {
    runExperiment(experimentId: Int, delay: Int): ExperimentResult @requireAuth
    findExperiment(id: Int): Experiment @requireAuth
    runBrowserExperimentDemo(testId: Int, thread: Int, loop: Int): RunBrowserExperimentResult @requireAuth
  }
`
