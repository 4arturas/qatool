import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectResolvers,
} from 'types/graphql'
import {QaObjectRelationship} from "src/models";
import {
  BODY,
  CASE, COLLECTION,
  getRandomIntInclusive, MSG_OUTGOING,
  REMOVE,
  REPLACE,
  RESPONSE,
  RESULT,
  SERVER,
  SUITE,
  TEST
} from "src/functions/global";
import {createExperimentResult} from "src/services/experimentResults/experimentResults";
import {qaObjectRelationships} from "src/services/qaObjectRelationships/qaObjectRelationships";
import QaObjectModel  from 'src/models/QaObject'

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
  return  db.qaObject.create({
    data: input,
  });
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

  const parent = await QaObjectRelationship.where({ parentId: id});
  parent.map( c => c.destroy({ throw: true }) );
  const children = await QaObjectRelationship.where({ childrenId: id});
  children.map( c => c.destroy({ throw: true }) );

  const qaObjectModel = await QaObjectModel.where( {id:id} );
  qaObjectModel.map( q => q.destroy( { throw: true } ) );

  return id;
}

export const searchQaObjects = async ( { searchCriteria, page, pageSize, count } ) =>
{
  const offset = (page - 1) * pageSize

  const findClause = {
    take: pageSize,
    skip: offset,

    include: {
      user: { select: { email: true } }
    },

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

  const recordsCount = count === 0 ? (await db.qaObject.findMany(findClauseForCount)).length : count;

  return {
    qaObjects: qaObjects,
    count: recordsCount,
    page: page,
    pageSize: pageSize
  };
}

export const belongings = async ( { parentId} ) =>
{
  const children = await QaObjectRelationship.where({ parentId: parentId});
  return db.qaObject.findMany( { where: { id: { in: children.map( c => c.childrenId ) } } } );
}


const exp = async ( id ) =>
{
  try {

    const parent = await db.qaObject.findUnique({where: {id: id}});
    const suites = await QaObjectRelationship.where({parentId: id});
    const children = [];
    for (let i = 0; i < suites.length; i++) {
      const suite = suites[i];
      const child = await exp(suite.childrenId);
      children.push(child);
    }

    return {
      parent: parent,
      children: children
    };
  }
  catch ( e )
  {
    console.log( e );
    return null;
  }
}

const getRelations = async ( id, arr ) =>
{
  const relations = await QaObjectRelationship.where({parentId: id});
  for (let i = 0; i < relations.length; i++) {
    const relation = relations[i];
    const { parentId, childrenId } = relation;
    arr.push( { parentId: parentId, childrenId: childrenId } );
    await getRelations( childrenId, arr );
  }
}


export const QaObject: QaObjectResolvers = {
  type: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).type(),
  parent: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).parent(),
  children: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).children(),
}
