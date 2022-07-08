export const schema = gql`
  type ExperimentResult {
    id: Int!
    type: Int!
    experimentId: Int
    collectionId: Int
    suiteId: Int
    caseId: Int
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


  type Query {
    experimentResults: [ExperimentResult!]! @requireAuth
    experimentResultsByExperimentId(experimentId: Int!): [ExperimentResult!]! @requireAuth
    experimentResult(id: Int!): ExperimentResult @requireAuth
    timeline(id: Int!): [ExperimentResult] @requireAuth
    experimentResultsPage(page: Int, pageSize: Int, count: Int): ExperimentResultPage @requireAuth
  }

  input CreateExperimentResultInput {
    type: Int!
    experimentId: Int
    collectionId: Int
    suiteId: Int
    caseId: Int
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
