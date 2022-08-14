import type { FindMergeQuery, FindMergeQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Merge from "src/components/Merge/Merge";

export const QUERY = gql`
  query FindMergeQuery($testId: Int!) {
    merge: findMergeObjects(testId: $testId) {
      caseParent { id, typeId, name, executed, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
      body { id, typeId, name, executed, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
      test { id, typeId, name, executed, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
      replace { id, typeId, name, executed, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
      remove { id, typeId, name, executed, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
      result { id, typeId, name, executed, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindMergeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  merge,
}: CellSuccessProps<FindMergeQuery, FindMergeQueryVariables>) => {
  console.log( merge );
  return <Merge merge={merge} />
}
