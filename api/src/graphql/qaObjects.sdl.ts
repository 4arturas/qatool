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
    address:     String
    method:      String
    header:      String
    createdAt: DateTime!
    updatedAt: DateTime!
    executed: Boolean
    userId: Int!
    user: User
    parent: [QaObjectRelationship]
  }

  type QaObjectPage {
    qaObjects: [QaObject]
    count: Int!
    page: Int!
    pageSize: Int
  }

  input QaObjectSearchCriteria {
    typeId: [Int]
    name: String
  }

  type Relations {
    parentId: Int
    childrenId: Int
  }

  type Query {
    qaObjects: [QaObject!]! @requireAuth
    qaObject(id: Int!): QaObject @requireAuth
    getQaObjectsByType(typeId: Int!): [QaObject] @requireAuth
    qaObjectsByTypeId(typeId: Int!): [QaObject] @requireAuth
    qaObjectsPage(page: Int, pageSize: Int): QaObjectPage @requireAuth
    searchQaObjects(searchCriteria: QaObjectSearchCriteria, page: Int, pageSize: Int, count: Int): QaObjectPage @requireAuth
    belongings(parentId: Int): [QaObject] @requireAuth
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
    address:     String
    method:      String
    header:      String
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
    address:     String
    method:      String
    header:      String
    executed: Boolean
  }

  type Mutation {
    createQaObject(input: CreateQaObjectInput!): QaObject! @requireAuth
    updateQaObject(id: Int!, input: UpdateQaObjectInput!): QaObject!
      @requireAuth
    deleteQaObject(id: Int!): QaObject! @requireAuth
    deleteQaObjectWithChildren(id: Int!): Int! @requireAuth
  }
`
