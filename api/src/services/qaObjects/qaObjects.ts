import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectResolvers,
} from 'types/graphql'
import {QaObjectRelationship} from "src/models";

export const qaObjects: QueryResolvers['qaObjects'] = () => {
  return db.qaObject.findMany()
}

export const qaObject: QueryResolvers['qaObject'] = ({ id }) => {
  return db.qaObject.findUnique({
    where: { id },
  })
}

export const getQaObjectsByType: QueryResolvers['getQaObjectsByType'] = ({ typeId }) => {
  return db.qaObject.findMany({
    where: { typeId },
  })
}

export const qaObjectsByTypeId: QueryResolvers['qaObjectsByTypeId'] = ({ typeId }) => {
  return db.qaObject.findMany({
    where: { typeId },
  })
}

export const createQaObject: MutationResolvers['createQaObject'] = ({
  input,
}) => {
  return db.qaObject.create({
    data: input,
  })
}

export const updateQaObject: MutationResolvers['updateQaObject'] = ({
  id,
  input,
}) => {
  return db.qaObject.update({
    data: input,
    where: { id },
  })
}

export const deleteQaObject: MutationResolvers['deleteQaObject'] = ({ id }) => {
  return db.qaObject.delete({
    where: { id },
  })
}

export const qaObjectsPage = ({ page, pageSize }) => {

  const offset = (page - 1) * pageSize

  return {
    qaObjects: db.qaObject.findMany({
      take: pageSize,
      skip: offset,
      // orderBy: { id: 'desc' },
    }),
    count: db.qaObject.count(),
    page: page,
    pageSize: pageSize
  };
}

export const deleteQaObjectWithChildren = async ({ id }) => {

  const children = await QaObjectRelationship.where({ parentId: id});
  children.map( c => c.destroy({ throw: true }) );

  return deleteQaObject( { id: id } );
}


export const QaObject: QaObjectResolvers = {
  type: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).type(),
  parent: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).parent(),
  children: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).children(),
}
