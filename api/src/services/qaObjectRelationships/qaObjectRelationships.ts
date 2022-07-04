import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectRelationshipResolvers,
} from 'types/graphql'

export const qaObjectRelationships: QueryResolvers['qaObjectRelationships'] =
  () => {
    return db.qaObjectRelationship.findMany()
  }

export const qaObjectRelationshipsWithTheSameParentId: QueryResolvers['qaObjectRelationships'] =
  (parentId) => {
    return db.qaObjectRelationship.findMany({where: parentId})
  }

export const qaObjectRelationship: QueryResolvers['qaObjectRelationship'] = ({
  id,
}) => {
  return db.qaObjectRelationship.findUnique({
    where: { id },
  })
}

export const createQaObjectRelationship: MutationResolvers['createQaObjectRelationship'] =
  ({ input }) => {
    return db.qaObjectRelationship.create({
      data: input,
    })
  }

export const updateQaObjectRelationship: MutationResolvers['updateQaObjectRelationship'] =
  ({ id, input }) => {
    return db.qaObjectRelationship.update({
      data: input,
      where: { id },
    })
  }

export const deleteQaObjectRelationship: MutationResolvers['deleteQaObjectRelationship'] =
  ({ id }) => {
    return db.qaObjectRelationship.delete({
      where: { id },
    })
  }


export const QaObjectRelationship: QaObjectRelationshipResolvers = {
  parent: (_obj, { root }) =>
    db.qaObjectRelationship.findUnique({ where: { id: root.id } }).parent(),
  children: (_obj, { root }) =>
    db.qaObjectRelationship.findUnique({ where: { id: root.id } }).children(),
}
