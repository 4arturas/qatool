export const schema = gql`

  type Merge {
    caseParent: QaObject!
    body: QaObject!
    test: QaObject!
    replace: QaObject!
    remove: QaObject!
    result: QaObject!
  }

  type Query {
    findMergeObjects(testId: Int!): Merge @requireAuth
  }


`
