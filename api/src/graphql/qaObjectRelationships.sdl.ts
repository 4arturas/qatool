export const schema = gql`
  type QaObjectRelationship {
    id: Int!
    parentId: Int!
    childrenId: Int!
    childrenObjectTypeId: Int!
  }

  type Query {
    qaObjectRelationships: [QaObjectRelationship!]! @requireAuth
    qaObjectRelationship(id: Int!): QaObjectRelationship @requireAuth
    qaObjectRelationshipsWithTheSameParentId(parentId: Int!): [QaObjectRelationship!] @requireAuth
  }

  input CreateQaObjectRelationshipInput {
    parentId: Int!
    childrenId: Int!
  }

  input UpdateQaObjectRelationshipInput {
    parentId: Int
    childrenId: Int
  }

  type Mutation {
    createQaObjectRelationship(
      input: CreateQaObjectRelationshipInput!
    ): QaObjectRelationship! @requireAuth
    updateQaObjectRelationship(
      id: Int!
      input: UpdateQaObjectRelationshipInput!
    ): QaObjectRelationship! @requireAuth
    deleteQaObjectRelationship(id: Int!): QaObjectRelationship! @requireAuth
    detachQaObjectRelationship(id: Int!): QaObjectRelationship! @requireAuth
  }
`
