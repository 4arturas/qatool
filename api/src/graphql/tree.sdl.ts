export const schema = gql`
  type TreeHierarchy {
    id: Int!
    parentId: Int!
    childrenId: Int!
    childrenObjectTypeId: Int!
  }

  type Tree {
    parentId: Int!
    hierarchy: [TreeHierarchy] @requireAuth
    objects: [QaObject] @requireAuth
  }

  type Query {
    fetchHierarchy(id: Int!): Tree! @requireAuth
  }
`
