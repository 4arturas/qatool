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

export const searchQaObjects = async ( { searchCriteria, page, pageSize } ) =>
{
  const offset = (page - 1) * pageSize

  const findClause = {
    take: pageSize,
    skip: offset,
      // views: { where: { createdAt: dateFilter } },

    // where: whereClause
    // orderBy: { id: 'desc' },
  };

  const whereClause = {};
  Object.keys(searchCriteria).map( k => {
    if ( searchCriteria[k].length !== 0 ) {
      if (Array.isArray(searchCriteria[k])) {
        whereClause[k] = {in: searchCriteria[k]}
      } else if (typeof (searchCriteria[k]) === 'string' && searchCriteria[k].length > 0) {
        whereClause[k] = {contains: searchCriteria[k]};
      } else {
        whereClause[k] = searchCriteria[k];
      }
    }
  });

  const findClauseForCount = {};
  if ( Object.keys(searchCriteria).length > 0 )
  {
    findClause.where = whereClause;
    findClauseForCount.where = whereClause;
  }

  const qaObjects = await db.qaObject.findMany(findClause);
  //TODO: Two queries, not good, rethink!
  const count = (await db.qaObject.findMany(findClauseForCount)).length;


  return {
    qaObjects: qaObjects,
    count: count,
    page: page,
    pageSize: pageSize
  };
}

export const belongings = async ( { parentId} ) =>
{
  const children = await QaObjectRelationship.where({ parentId: parentId});
  return db.qaObject.findMany( { where: { id: { in: children.map( c => c.childrenId ) } } } );
}


export const QaObject: QaObjectResolvers = {
  type: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).type(),
  parent: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).parent(),
  children: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).children(),
}
