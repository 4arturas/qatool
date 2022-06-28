import { db } from 'src/lib/db'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const messages: QueryResolvers['messages'] = () => {
  return db.message.findMany()
}

export const message: QueryResolvers['message'] = ({ id }) => {
  return db.message.findUnique({
    where: { id },
  })
}

export const createMessage: MutationResolvers['createMessage'] = ({
  input,
}) => {
  return db.message.create({
    data: input,
  })
}

export const updateMessage: MutationResolvers['updateMessage'] = ({
  id,
  input,
}) => {
  return db.message.update({
    data: input,
    where: { id },
  })
}

export const deleteMessage: MutationResolvers['deleteMessage'] = ({ id }) => {
  return db.message.delete({
    where: { id },
  })
}

export const messagePage = ({ page, pageSize }) => {

  const offset = (page - 1) * pageSize

  return {
    messages: db.message.findMany({
      take: pageSize,
      skip: offset,
      orderBy: { responseDate: 'desc' },
    }),
    count: db.message.count(),
    page: page,
    pageSize: pageSize
  }
}
