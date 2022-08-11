export const schema = gql`
  type Mutation {
    addBlockly(blocklyJsonOld: String!, blocklyJsonNew: String!):            Int! @requireAuth(roles: ["admin"])
  }
`
