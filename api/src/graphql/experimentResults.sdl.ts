export const schema = gql`
  type ExperimentResult {
    id: Int!
    type: Int!
    experimentId: Int
    collectionId: Int
    suiteId: Int
    caseId: Int
    testId: Int
    thread: Int
    loop: Int
    paymentId: String
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    status: Int
    statusText: String
    txnId: String
    jsonata: String
  }

  type ExperimentResultPage {
    experimentResults: [ExperimentResult]
    page: Int!
    pageSize: Int
    count: Int
  }

  type ExperimentResultAndExperimentOwner {
    experimentOwner: QaObject
    experimentResults: [ExperimentResult]
  }


  type Query {
    experimentResults: [ExperimentResult!]! @requireAuth
    experimentResultsByExperimentId(id: Int!): ExperimentResultAndExperimentOwner! @requireAuth
    experimentResultsByTestId(caseId: Int!, testId: Int!): ExperimentResultAndExperimentOwner! @requireAuth
    experimentResult(id: Int!): ExperimentResult @requireAuth
    timeline(id: Int!): [ExperimentResult] @requireAuth
    experimentResultsPage(page: Int, pageSize: Int, count: Int): ExperimentResultPage @requireAuth
    getExperimentResults(experimentId: Int): [ExperimentResult] @requireAuth
  }

  input CreateExperimentResultInput {
    type: Int!
    experimentId: Int
    collectionId: Int
    suiteId: Int
    caseId: Int
    testId: Int
    thread: Int
    loop: Int
    paymentId: String
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    status: Int
    statusText: String
    txnId: String
    jsonata: String
  }

  input UpdateExperimentResultInput {
    type: Int
    experimentId: Int
    collectionId: Int
    suiteId: Int
    caseId: Int
    testId: Int
    thread: Int
    loop: Int
    paymentId: String
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    status: Int
    statusText: String
    txnId: String
    jsonata: String
  }

  type Mutation {
    createExperimentResult(
      input: CreateExperimentResultInput!
    ): ExperimentResult! @requireAuth
    updateExperimentResult(
      id: Int!
      input: UpdateExperimentResultInput!
    ): ExperimentResult! @requireAuth
    deleteExperimentResult(id: Int!): ExperimentResult! @requireAuth
  }
`
