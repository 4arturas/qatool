import {db} from "src/lib/db";
import {BODY, CASE, REMOVE, REPLACE, RESPONSE, RESULT, TEST} from "src/functions/global";

export const findMergeObjects = async ( { testId } )  =>
{
  const caseRelation = await db.qaObjectRelationship.findMany({
      where: {
        childrenId: {
          equals: testId
        }
      }
    });

  const bodyRelation = await db.qaObjectRelationship.findFirst({
    where: {
      AND: [
        {
          parentId: caseRelation[0].parentId
        },
        {
          childrenObjectTypeId: BODY
        }
      ]
    }
  });

  const treeRelations = await db.qaObjectRelationship.findMany({
    where: {
      AND: [
        {
          parentId: testId
        },
        {
          childrenObjectTypeId: { in: [REPLACE, REMOVE, RESULT] }
        }
      ]
    }
  });

  const idFetchFromDatabase = [caseRelation[0].parentId, bodyRelation.childrenId, testId, ...treeRelations.map( r => r.childrenId ) ];

  const qaObjects = await db.qaObject.findMany({
    where: {
      id: {
        in: idFetchFromDatabase
      }
    },
    include: {
      organization: { select: { id: true,name: true } },
      parent: {}
    }
  });

  const caseParent = qaObjects.find( qa => qa.typeId === CASE );
  const body = qaObjects.find( qa => qa.typeId === BODY );
  const test = qaObjects.find( qa => qa.typeId === TEST );
  const replace = qaObjects.find( qa => qa.typeId === REPLACE );
  const remove = qaObjects.find( qa => qa.typeId === REMOVE );
  const result = qaObjects.find( qa => qa.typeId === RESULT );

  return {
    caseParent: caseParent,
    body: body,
    test: test,
    replace: replace,
    remove: remove,
    result: result
  };
}
