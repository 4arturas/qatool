export const schema = gql`
  type QaObject {
    id:           Int!
    type:         QaObjectType!
    typeId:       Int!
    name:         String!
    description:  String
    batchId:      Int
    threads:      Int
    loops:        Int
    json:         String
    jsonata:      String
    address:      String
    method:       String
    header:       String
    createdAt:    DateTime!
    updatedAt:    DateTime!
    executed:     DateTime
    orgId:        Int!
    organization: Organization
    parent:       [QaObjectRelationship]
  }

  type QaObjectPage {
    qaObjects:    [QaObject]
    count:        Int!
    page:         Int!
    pageSize:     Int
  }

  input QaObjectSearchCriteria {
    typeId:       [Int]
    name:         String
  }

  type Relations {
    parentId:     Int
    childrenId:   Int
  }

  type Query {
    qaObjects:                                                                                      [QaObject!]!  @requireAuth
    qaObject(id: Int!):                                                                             QaObject      @requireAuth
    getQaObjectsByType(id: Int, typeId: Int!):                                                      [QaObject]    @requireAuth
    qaObjectsByTypeId(typeId: Int!):                                                                [QaObject]    @requireAuth
    qaObjectsPage(page: Int, pageSize: Int):                                                        QaObjectPage  @requireAuth
    searchQaObjects(searchCriteria: QaObjectSearchCriteria, page: Int, pageSize: Int, count: Int):  QaObjectPage  @requireAuth
    belongings(parentId: Int):                                                                      [QaObject]    @requireAuth(roles: ["admin"])
  }



  input CreateQaObjectInput {
    typeId:       Int!
    name:         String!
    orgId:        Int!
    description:  String
    batchId:      Int
    threads:      Int
    loops:        Int
    json:         String
    jsonata:      String
    address:      String
    method:       String
    header:       String
  }

  input UpdateQaObjectInput {
    name:         String
    orgId:        Int
    description:  String
    batchId:      Int
    threads:      Int
    loops:        Int
    json:         String
    jsonata:      String
    address:      String
    method:       String
    header:       String
    userId:       Int
  }

  type Mutation {
    createQaObject(input: CreateQaObjectInput!):            QaObject! @requireAuth(roles: ["admin"])
    updateQaObject(id: Int!, input: UpdateQaObjectInput!):  QaObject! @requireAuth(roles: ["admin"])
    deleteQaObject(id: Int!):                               QaObject! @requireAuth(roles: ["admin"])
    deleteQaObjectWithChildren(id: Int!):                   Int!      @requireAuth(roles: ["admin"])
    deepClone(id: Int!, name: String!):                     QaObject! @requireAuth(roles: ["admin"])
  }
`
