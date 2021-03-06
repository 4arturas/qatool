import type { FindExperimentQuery, FindExperimentQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import React from "react";

import ExperimentResult from "src/components/ExperimentResult/ExperimentResult";

export const QUERY = gql`
  query FetchExperimentResults($id: Int!) {
    experiment: experimentResultsByExperimentId(id: $id) {
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

export const Failure = ( { error }: CellFailureProps<FindExperimentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ experiment }: CellSuccessProps<FindExperimentQuery, FindExperimentQueryVariables>) => {
  return <ExperimentResult experiment={experiment} />
}
