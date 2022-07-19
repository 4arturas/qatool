export const schema = gql`

  type Organization {
    id: Int!
    name: String!
  }

  type Query {
    getOrganization(id: Int!): Organization @requireAuth(roles: ["admin"])
    getOrganizations: [Organization] @requireAuth(roles: ["admin"])
  }

  input CreateOrganizationInput {
    name: String!
  }

  input UpdateOrganizationInput {
    id: Int!
    name: String!
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization! @requireAuth(roles: ["admin"])
    updateOrganization(id: Int!, input: UpdateOrganizationInput!): Organization! @requireAuth(roles: ["admin"])
    deleteOrganization(id: Int!): Organization! @requireAuth(roles: ["admin"])
  }
`
