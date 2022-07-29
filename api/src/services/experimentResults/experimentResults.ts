import { db } from 'src/lib/db'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import ExperimentResult from 'src/models/ExperimentResult'
import {qaObject} from "src/services/qaObjects/qaObjects";

export const experimentResults: QueryResolvers['experimentResults'] = () => {
  return db.experimentResult.findMany()
}

export const experimentResultsByExperimentId: QueryResolvers['experimentResultsByExperimentId'] = async ({ id}) => {
  const experimentOwner = await qaObject( {id:id} );
  let experimentResults: any;

  experimentResults = await db.experimentResult.findMany({
    where: {experimentId: {equals: id}},
  });

  return {
    experimentOwner: experimentOwner,
    experimentResults: experimentResults
  }
}

export const experimentResultsByTestId: QueryResolvers['experimentResultsByTestId'] = async ({ caseId, testId}) => {
  const experimentOwner = await qaObject( {id:testId} );
  let experimentResults: any;

  experimentResults = await db.experimentResult.findMany({
    where: { caseId: { equals: caseId }, testId: { equals: testId } },
  });

  return {
    experimentOwner: experimentOwner,
    experimentResults: experimentResults
  }
}

export const experimentResult: QueryResolvers['experimentResult'] = ({
  id,
}) => {
  return db.experimentResult.findUnique({
    where: { id },
  })
}

export const createExperimentResult: MutationResolvers['createExperimentResult'] =
  ({ input }) => {
    return db.experimentResult.create({
      data: input,
    })
  }

export const updateExperimentResult: MutationResolvers['updateExperimentResult'] =
  ({ id, input }) => {
    return db.experimentResult.update({
      data: input,
      where: { id },
    })
  }

export const deleteExperimentResult: MutationResolvers['deleteExperimentResult'] =
  ({ id }) => {
    return db.experimentResult.delete({
      where: { id },
    })
  }

export const timeline: QueryResolvers['timeline'] = async ({ id }) => {
  const resultArr = []
  const outgoing = await experimentResult( { id } );
  if ( outgoing ) {
    resultArr.push(outgoing)

    if ( outgoing.txnId )
    {
      const incoming = await ExperimentResult.findBy({ txnId: outgoing.txnId });
      if ( incoming )
      {
        resultArr.push(incoming);
        if ( incoming.paymentId )
        {
          const settled = await ExperimentResult.findBy({ paymentId: incoming.paymentId, txnId: null });
          if ( settled )
            resultArr.push( settled );
        }
      }
    } // end incoming
  } // outgoing
  return resultArr;
}

export const experimentResultsPage = ({ page, pageSize, count }) => {

  const offset = (page - 1) * pageSize
console.log( offset );
  return {
    experimentResults: db.experimentResult.findMany({
      take: pageSize,
      skip: offset,
      // orderBy: { id: 'desc' },
    }),
    count: count && count > 0 ? count: db.experimentResult.count(),
    page: page,
    pageSize: pageSize
  };
}
