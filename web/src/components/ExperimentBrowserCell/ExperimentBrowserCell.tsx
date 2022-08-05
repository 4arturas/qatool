import type { FindExperimentBrowserQuery, FindExperimentBrowserQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import ExperimentBrowser from '../ExperimentBrowser/ExperimentBrowser';

export const QUERY = gql`
  query FindTreeQueryForBrowserExperiment($id: Int!) {
    tree: fetchHierarchy(id: $id) {
      parentId
      hierarchy {
        id
        parentId
        childrenId
        childrenObjectTypeId
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
        orgId
        organization { id name }
        parent { id parentId childrenId childrenObjectTypeId }
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindExperimentBrowserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ( { tree }: CellSuccessProps<FindExperimentBrowserQuery, FindExperimentBrowserQueryVariables>) => {
  return <ExperimentBrowser qaObject={tree.objects.find( o => o.id === tree.parentId )} hierarchy={tree.hierarchy} objects={tree.objects}/>
}
