import type { ExperimentResultsPageQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import ExperimentResults from "src/components/ExperimentResults/ExperimentResults";
import React from "react";


export const QUERY = gql`
  query ExperimentResultsPageQuery($page: Int, $pageSize: Int, $count: Int) {
    experimentResultsPage(page: $page, pageSize: $pageSize, count: $count)  {
    experimentResults {
      id
      status
      loop
      collectionId
      caseId
      error
      jsonata
      paymentId
      request
      requestDate
      response
      responseDate
      statusText
      suiteId
      thread
      txnId
      type
    },
    page
    pageSize
    count
  }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ experimentResultsPage }: CellSuccessProps<ExperimentResultsPageQuery>) => {

  return (
    <ExperimentResults
      experiments={experimentResultsPage.experimentResults}/>
  )
}
