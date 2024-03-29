import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  QaObjectResolvers,
} from 'types/graphql'
import {QaObjectRelationship} from "src/models";
import {EXPERIMENT, ROLE_ADMIN} from "src/functions/global";
import {createQaObjectRelationship} from "src/services/qaObjectRelationships/qaObjectRelationships";
import {context} from "@redwoodjs/graphql-server";
import {Prisma} from "@prisma/client";

export const qaObjects: QueryResolvers['qaObjects'] = () => {
  const query = {
    where: { AND: [] },
  };

  addFilterDependentOnRoles( query.where.AND );

  return db.qaObject.findMany()
}

export const qaObject = ({ id }) => {
  const query = {
    where: { AND: [ { id: { equals:id } } ] },
    include: {
      organization: { select: { id: true, name: true } },
      parent: {  },
      children:  {  }
    }
  };

  addFilterDependentOnRoles( query.where.AND );

  return db.qaObject.findFirst( query );
}

export const getQaObjectsByType: QueryResolvers['getQaObjectsByType'] = async ({ id, typeId }) => {

  let query: any;

  if ( !id )
    query = Prisma.sql`SELECT * FROM QaObject qo where qo.typeId = ${typeId} AND qo.executed IS NULL  AND qo.id not in (
      SELECT r.childrenId as id from QaObjectRelationship r WHERE r.childrenId in ( SELECT id from QaObject o where o.typeId  = ${typeId} )
    )`;
  else
    query = Prisma.sql`select *
                       from QaObject qo
                       where qo.id in (
                         SELECT childrenId
                         FROM QaObjectRelationship qor
                         where qor.parentId = ${id} and qor.childrenObjectTypeId = ${typeId}
                       )
      UNION
        SELECT * FROM QaObject qo where qo.typeId = ${typeId} AND qo.executed IS NULL  AND qo.id not in (
      SELECT r.childrenId as id from QaObjectRelationship r WHERE r.childrenId in ( SELECT id from QaObject o where o.typeId  = ${typeId} )
    )`;

  return db.$queryRaw( query );
}

export const qaObjectsByTypeId: QueryResolvers['qaObjectsByTypeId'] = ({ typeId }) => {
  const query = {
    where: { typeId, AND: [] },
  };

  addFilterDependentOnRoles( query.where.AND );

  return db.qaObject.findMany( query );
}

export const createQaObject: MutationResolvers['createQaObject'] = ({ input}) => {
  return db.qaObject.create({
    data: input,
    include: {
      organization: { select: { id: true, name: true } },
      parent: {},
      children:  {}
    },
  });
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

  const query = {
    take: pageSize,
    skip: offset,
    where: { AND: [] },
    // orderBy: { id: 'desc' },
  };

  addFilterDependentOnRoles( query.where.AND );

  return {
    qaObjects: db.qaObject.findMany(query),
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

/*  if ( !context.currentUser.roles.includes( ROLE_ADMIN ) )
  {
    whereClause.AND.push( { typeId: { equals: EXPERIMENT } } );
  }*/

  addFilterDependentOnRoles( whereClause.AND );

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
    const { parentId, childrenId, childrenObjectTypeId } = relation;
    arr.push( { parentId: parentId, childrenId: childrenId, childrenObjectTypeId: childrenObjectTypeId } );
    await getRelations( childrenId, arr );
  }
}

export const deepClone = async ( { id, name } ) =>
{
  const relations = [];
  await getRelations( id, relations );

  let hashTable = {};
  for ( let i = 0; i < relations.length; i++ )
  {
    const r = relations[i];
    if ( !hashTable[r.parentId] )
      hashTable[r.parentId] = { original: null, clone: null };
    if ( !hashTable[r.childrenId] )
      hashTable[r.childrenId] = { original: null, clone: null }
  }

  const idUniqueArray:Array<number> = Array.from(new Set(Object.keys( hashTable ))).map( id => parseInt( id ) );
  const objects = await db.qaObject.findMany( {
    where: { id: { in: idUniqueArray } }
  } );
  idUniqueArray.map( id => hashTable[id].original = objects.find( o => o.id === id ) );


  // Assign new name
  hashTable[id].original.name = name;

  // Clone objects
  const keys = Object.keys( hashTable );
  for ( let i = 0; i < keys.length; i++ )
  {
    const key = keys[i];
    const original = hashTable[key].original;
    delete original.id;
    delete original.createdAt;
    delete original.updatedAt;
    original.executed = null;

    hashTable[key].clone = await db.qaObject.create( { data: original } );
  }

  const relationsGroup = {};
  for ( let i = 0; i < relations.length; i++ )
  {
    // Don't allow duplicates
    const group = `${relations[i].parentId}-${relations[i].childrenId}`;
    if ( relationsGroup[group] )
      continue;
    relationsGroup[group] = group;

    relations[i].parentId = hashTable[relations[i].parentId].clone.id;
    relations[i].childrenId = hashTable[relations[i].childrenId].clone.id;
    await createQaObjectRelationship( {input:relations[i]} );
  }

  const query = {
    where: { id: { equals:hashTable[id].clone.id } },
    include: {
      organization: { },
      parent: {  },
      // children:  {  }
    }
  };
  const root = await db.qaObject.findFirst( query );
  return root;
}

const addFilterDependentOnRoles = ( AND:Array<any> ): Array<any> =>
{
  if ( context.currentUser.roles.includes(ROLE_ADMIN) )
    return;

  const orgId = context.currentUser.orgId;
  AND.push( { orgId: { equals: orgId } } );
}


export const QaObject: QaObjectResolvers = {
  type: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).type(),
  parent: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).parent(),
  children: (_obj, { root }) =>
    db.qaObject.findUnique({ where: { id: root.id } }).children(),
}
