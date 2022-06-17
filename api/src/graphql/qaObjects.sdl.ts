export const schema = gql`
  type QaObject {
    id: Int!
    type: QaObjectType!
    typeId: Int!
    name: String!
    description: String
    batchId: Int
    threads: Int
    loops: Int
    json: String
    jsonata: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    qaObjects: [QaObject!]! @requireAuth
    qaObject(id: Int!): QaObject @requireAuth
    getQaObjectsByType(typeId: Int!): [QaObject] @requireAuth
  }

  input CreateQaObjectInput {
    typeId: Int!
    name: String!
    description: String
    batchId: Int
    threads: Int
    loops: Int
    json: String
    jsonata: String
  }

  input UpdateQaObjectInput {
    typeId: Int
    name: String
    description: String
    batchId: Int
    threads: Int
    loops: Int
    json: String
    jsonata: String
  }

  type Mutation {
    createQaObject(input: CreateQaObjectInput!): QaObject! @requireAuth
    updateQaObject(id: Int!, input: UpdateQaObjectInput!): QaObject!
      @requireAuth
    deleteQaObject(id: Int!): QaObject! @requireAuth
  }
`
