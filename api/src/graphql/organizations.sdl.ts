export const schema = gql`

  type Organization {
    id: Int!
    name: String!
  }

  type Query {
    getOrganization(id: Int!): Organization @requireAuth(roles: ["admin"])
    getOrganizations: [Organization] @requireAuth(roles: ["admin"])
  }

  input UpdateOrganizationInput {
    name: String!
  }

  type Mutation {
    deleteOrganization(id: Int!): Int! @requireAuth(roles: ["admin"])
    updateOrganization(id: Int!, input: UpdateOrganizationInput!): User! @requireAuth(roles: ["admin"])
  }
`
