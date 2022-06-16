import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectTypeResolvers,
} from 'types/graphql'

export const qaObjectTypes: QueryResolvers['qaObjectTypes'] = () => {
  return db.qaObjectType.findMany()
}

export const qaObjectType: QueryResolvers['qaObjectType'] = ({ id }) => {
  return db.qaObjectType.findUnique({
    where: { id },
  })
}

export const createQaObjectType: MutationResolvers['createQaObjectType'] = ({
  input,
}) => {
  return db.qaObjectType.create({
    data: input,
  })
}

export const updateQaObjectType: MutationResolvers['updateQaObjectType'] = ({
  id,
  input,
}) => {
  return db.qaObjectType.update({
    data: input,
    where: { id },
  })
}

export const deleteQaObjectType: MutationResolvers['deleteQaObjectType'] = ({
  id,
}) => {
  return db.qaObjectType.delete({
    where: { id },
  })
}

export const QaObjectType: QaObjectTypeResolvers = {
  QaObject: (_obj, { root }) =>
    db.qaObjectType.findUnique({ where: { id: root.id } }).QaObject(),
}
