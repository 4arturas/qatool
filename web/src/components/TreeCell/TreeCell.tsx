import type { FindTreeQuery, FindTreeQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import Tree from "src/components/Tree/Tree";
import {Toaster} from "@redwoodjs/web/toast";

export const QUERY = gql`
  query FindTreeQuery($id: Int!) {
    tree: fetchHierarchy(id: $id) {
      parentId
      hierarchy {
        id
        parentId
        childrenId
      }
      objects {
        id
        typeId
        name
        description
        batchId
        threads
        loops
        json
        jsonata
        address
        method
        header
        createdAt
        updatedAt
        executed
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ( { error }: CellFailureProps<FindTreeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ( { tree }: CellSuccessProps<FindTreeQuery, FindTreeQueryVariables> ) => {
  return <>
    <Toaster toastOptions={{ className: 'rw-toast', duration: 30000 }} />
    <Tree tree={tree} relationId={null} />
  </>
}
