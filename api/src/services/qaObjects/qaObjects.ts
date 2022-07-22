import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectResolvers,
} from 'types/graphql'
import {QaObjectRelationship} from "src/models";
import {EXPERIMENT, ROLE_ADMIN} from "src/functions/global";

export const qaObjects: QueryResolvers['qaObjects'] = () => {
  return db.qaObject.findMany()
}

export const qaObject: QueryResolvers['qaObject'] = ({ id }) => {
  return db.qaObject.findUnique({
    where: { id },
    include: {
      organization: { select: { id: true, name: true } },
      parent: {  },
      children:  {  }
    }
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

export const createQaObject: MutationResolvers['createQaObject'] = async ({ input}) => {
  const qaObject = await db.qaObject.create({
    data: { ...input, orgId: context.currentUser.orgId },
  });

  return { ...qaObject, ...{ user: { email: context.currentUser.email } } };
}

export const updateQaObject: MutationResolvers['updateQaObject'] = ( { id,  input }) => {
  return db.qaObject.update({
      data: input,
      where: {id},
      include: {
        organization: { select: { id: true, name: true } },
        parent: {},
        children:  {}
      },
    });
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
  await db.qaObjectRelationship.deleteMany({
    where: {
      OR: [
        {
          parentId: {
            equals: id
          }
        },
        {
          childrenId: {
            equals: id
          }
        }
      ]
    }
  });

  await db.qaObject.delete({
    where: { id },
  });

  return id;
}

export const searchQaObjects = async ( { searchCriteria, page, pageSize, count } ) =>
{
  const offset = (page - 1) * pageSize

  const findClause = {
    take: pageSize,
    skip: offset,

    /*select: {
      user: { select: { email: true } },
      children: {
        select: { childrenId: true }
      }
    },*/
    where: { AND: [] },
    include: {
      organization:     { select: { id: true, name: true } },
      // parent:   { select: { parentId: true } },
      parent: {  },
      children:  {  }
/*      select: {
        children:  { childrenId: true }
      }*/
    },

      // views: { where: { createdAt: dateFilter } },

    // where: whereClause
    // orderBy: { id: 'desc' },
  };

  const whereClause = { AND: [] };
  Object.keys(searchCriteria).map( k => {
    if ( searchCriteria[k].length !== 0 )
    {
      if ( Array.isArray(searchCriteria[k]))
      {
        const inStr = `{ "${k}": {"in": [${searchCriteria[k]}]} }`;
        whereClause.AND.push( JSON.parse( inStr ) );
      }
      else if (typeof (searchCriteria[k]) === 'string' && searchCriteria[k].length > 0)
      {
        const containsStr = `{ "${k}": {"contains": "${searchCriteria[k]}"} }`;
        whereClause.AND.push( JSON.parse( containsStr ) );
      }
      else
      {
        // whereClause[k] = searchCriteria[k];
      }
    }
  });

  if ( !context.currentUser.roles.includes( ROLE_ADMIN ) )
  {
    whereClause.AND.push( { typeId: { equals: EXPERIMENT } } );
  }

  const findClauseForCount = { where: whereClause };
  findClause.where = whereClause;

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
