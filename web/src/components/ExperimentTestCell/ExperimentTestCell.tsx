import type { FindExperimentTestQuery, FindExperimentTestQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import ExperimentResult from "src/components/ExperimentResult/ExperimentResult";
import React from "react";

export const QUERY = gql`
  query FetchExperimentTestResults($caseId: Int!, $testId: Int!) {
    experiment: experimentResultsByTestId(caseId: $caseId, testId: $testId) {
      experimentOwner { id typeId name }
      experimentResults {
        id
        type
        experimentId
        collectionId
        suiteId
        caseId
        testId
        thread
        loop
        request
        response
        requestDate
        responseDate
        status
        statusText
        txnId
        jsonata
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindExperimentTestQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ experiment }: CellSuccessProps<FindExperimentTestQuery, FindExperimentTestQueryVariables>) => {
  return <ExperimentResult experiment={experiment} />
}
