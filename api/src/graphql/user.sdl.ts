export const schema = gql`
  type UserRole {
    name: String
  }
  type User {
    id: Int!
    email: String!
    deleted: Date
    mfaSet: Boolean
    userRoles: [UserRole]
    orgId: Int!
    organization:  Organization
  }

  type Query {
    getUser(id: Int!): User @requireAuth(roles: ["admin"])
    getUsers: [User] @requireAuth(roles: ["admin"])
    showQrCodeImage(id: Int!): String @requireAuth
  }

  input UpdateUserInput {
    email: String!
    deleted: Date
    userRoles: [String]!
    orgId: Int!
  }

  type Mutation {
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth(roles: ["admin"])
    deleteUser(id: Int!): Int! @requireAuth(roles: ["admin"])
    setMfaCode(id: Int!, qrcode: String!): Int! @requireAuth
    resetMfa(id: Int!): Int! @requireAuth(roles: ["admin"])
  }
`
