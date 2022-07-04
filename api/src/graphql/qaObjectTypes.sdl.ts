export const schema = gql`
  type QaObjectType {
    id: Int!
    name: String!
  }

  type Query {
    qaObjectTypes: [QaObjectType!]! @requireAuth
    qaObjectType(id: Int!): QaObjectType @requireAuth
  }

  input CreateQaObjectTypeInput {
    name: String!
  }

  input UpdateQaObjectTypeInput {
    name: String
  }

  type Mutation {
    createQaObjectType(input: CreateQaObjectTypeInput!): QaObjectType!
      @requireAuth
    updateQaObjectType(
      id: Int!
      input: UpdateQaObjectTypeInput!
    ): QaObjectType! @requireAuth
    deleteQaObjectType(id: Int!): QaObjectType! @requireAuth
  }
`
