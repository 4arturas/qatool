import type { FindTimelineQuery, FindTimelineQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {MSG_INCOMING, MSG_OUTGOING} from "src/global";
import Timeline from "src/components/Timeline/Timeline";
import React from "react";

export const QUERY = gql`
  query FindTimelineQuery($id: Int!) {
    timeline: timeline(id: $id) {
        type
        paymentId
        request
        response
        requestDate
        responseDate
        jsonata
        txnId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindTimelineQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  timeline,
}: CellSuccessProps<FindTimelineQuery, FindTimelineQueryVariables>) => {
  return <Timeline experimentResults={timeline} />
}
