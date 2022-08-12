import {db} from "src/lib/db";
import {QaObjectRelationship} from "src/models";
import {getOrganizations} from "src/services/organizations/organizations";

interface Relation
{
  id: number; parentId:number; childrenId:number,childrenObjectTypeId:number;
}

const findRelationships = async ( id:number, tree:Array<Relation> )  =>
{
  const relations = await QaObjectRelationship.where( {parentId: id} );
  for ( let i = 0; i < relations.length; i++ )
  {
    const r: Relation = relations[i];
    tree.push( r );
    await findRelationships( r.childrenId, tree );
  }
}

export const fetchHierarchy = async ( { id } ) => {

  const tree:Array<Relation> = [];
  await findRelationships( id, tree );

  const parentArray:Array<number> = tree.map( t => t.parentId );
  const childrenArray:Array<number> = tree.map( t => t.childrenId );
  const concatArray:Array<number> = parentArray.concat(childrenArray);
  concatArray.push(id);
  const idUniqueArray = Array.from(new Set(concatArray));


  const objects = await db.qaObject.findMany( {
    where: { id: { in: idUniqueArray } },
    include: {
      organization:   { select: { id: true, name: true } },
      parent: { select: { id: true, parentId: true, childrenId: true, childrenObjectTypeId: true } },
    },
  } );

  const organizations = await getOrganizations();

  return {
    parentId:   id,
    hierarchy:  tree,
    objects:    objects,
    organizations: organizations
  }
}
