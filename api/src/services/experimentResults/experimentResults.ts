import { db } from 'src/lib/db'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const experimentResults: QueryResolvers['experimentResults'] = () => {
  return db.experimentResult.findMany()
}

export const experimentResultsByExperimentId: QueryResolvers['experimentResultsByExperimentId'] = ( {experimentId} ) => {
  return db.experimentResult.findMany({
    where: { experimentId: { equals: experimentId } }
  })
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
