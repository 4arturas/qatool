export const schema = gql`
  type UserRole {
    name: String!
  }
  type User {
    id: Int!
    email: String!
    deleted: Date
    userRoles: [String]
  }

  type Query {
    getUser(id: Int!): User @requireAuth
    getUsers: [User] @requireAuth
  }

  input UpdateUserInput {
    email: String!
    deleted: Date
    userRoles: [String]
  }

  type Mutation {
    deleteUser(id: Int!): Int! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
  }
`
