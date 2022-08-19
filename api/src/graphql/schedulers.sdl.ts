export const schema = gql`
  type Scheduler {
    id: Int!
    name: String!
    executeAt: DateTime!
    times: Int!
    executed: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    experiments: [QaObject]!
  }

  type SchedulerEdit {
    id: Int!
    name: String!
    executeAt: DateTime!
    times: Int!
    executed: Boolean!
    experiments: [Int]
    experimentsAll: [QaObject]
  }

  type Query {
    schedulers: [Scheduler!]! @requireAuth
    scheduler(id: Int!): Scheduler @requireAuth
    schedulerEdit(id: Int!): SchedulerEdit @requireAuth
  }

  input CreateSchedulerInput {
    name: String!
  }

  input UpdateSchedulerInput {
    id: Int
    name: String
    executeAt: DateTime
    times: Int
    experiments: [Int]
  }

  type Mutation {
    createScheduler(input: CreateSchedulerInput!): Scheduler! @requireAuth
    updateScheduler(id: Int!, input: UpdateSchedulerInput!): Scheduler! @requireAuth
    schedulerUpdate(id: Int!, input: UpdateSchedulerInput!): Scheduler! @requireAuth
    deleteScheduler(id: Int!): Scheduler! @requireAuth
  }
`
