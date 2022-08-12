import {
  BODY,
  CASE,
  COLLECTION,
  EXPERIMENT,
  ObjectNameToTypeLowercase, REMOVE,
  REPLACE, RESPONSE, RESULT,
  SERVER,
  SUITE,
  TEST
} from "src/functions/global";
import {deleteQaObject, updateQaObject} from "src/services/qaObjects/qaObjects";
import {db} from "src/lib/db";
import {createQaObjectRelationship} from "src/services/qaObjectRelationships/qaObjectRelationships";

export const addBlockly = async ( { blocklyJsonOld, blocklyJsonNew } ) =>
{
  const hierarchyNew:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>  = [];
  const objectsNew    = [];
  const jsonWorkspaceNew = JSON.parse( blocklyJsonNew );
  const blocksNew = jsonWorkspaceNew.blocks.blocks;
  for ( let i = 0; i < blocksNew.length; i++ )
  {
    const block = blocksNew[i];
    await ParseBlocklyFile( ' ', null, block, hierarchyNew, objectsNew );
  }

  const hierarchyOld:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>  = [];
  const objectsOld    = [];
  const jsonWorkspaceOld = JSON.parse( blocklyJsonOld );
  const blocksOld = jsonWorkspaceOld.blocks.blocks;
  for ( let i = 0; i < blocksOld.length; i++ )
  {
    const block = blocksOld[i];
    await ParseBlocklyFile( ' ', null, block, hierarchyOld, objectsOld );
  }

  // If there is no object in new objects list, then that means the object was deleted
  for ( let i = 0; i < objectsOld.length; i++ )
  {
    const objectOld = objectsOld[i];
    const objectNew = objectsNew.find(o => o.id === objectOld.id);
    const needsToBeUpdated:boolean = compare_Objects( objectOld, objectNew );
    if ( needsToBeUpdated )
    {
      await updateQaObject( { id:objectNew.id, input: objectNew } );
    }
    if (objectNew)
      continue;

    await deleteQaObject( {id:objectOld.id} );
  }

  // If there is no record was found in new hierarchy, that means that this relationship does not exist - we need to delete
  for ( let i = 0; i < hierarchyOld.length; i++ )
  {
    const hOld = hierarchyOld[i];
    const hNew = hierarchyNew.find( hn => hn.parentId === hOld.parentId && hn.childrenId === hOld.childrenId && hn.childrenObjectTypeId === hOld.childrenObjectTypeId )
    if ( hNew )
      continue;

    await db.qaObjectRelationship.deleteMany({
      where: {
        AND: [
          {
            parentId: {
              equals: hOld.parentId
            }
          },
          {
            childrenId: {
              equals: hOld.childrenId
            }
          },
          {
            childrenObjectTypeId: {
              equals: hOld.childrenObjectTypeId
            }
          }
        ]
      }
    });

  }

  // If there is no relation found in old hierarchy, then this means we need to create new relationship
  for ( let i = 0; i < hierarchyNew.length; i++ )
  {
    const hNew = hierarchyNew[i];
    const hOld = hierarchyOld.find(hn => hn.parentId === hNew.parentId && hn.childrenId === hNew.childrenId && hn.childrenObjectTypeId === hNew.childrenObjectTypeId)
    if (hOld)
      continue;

    await createQaObjectRelationship({input: hNew});
  }

  return 1;
}

const ProcessBlocklyBlock = async ( parentBlock, block, hierarchy:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>, objects  ) =>
{
  if ( !block.id )
  {
    const newObject = await db.qaObject.create( { data: block } );
    block.id = newObject.id;
  }

  if ( parentBlock )
  {
    const h = {parentId:parentBlock.id, childrenId:block.id, childrenObjectTypeId: block.typeId };
    hierarchy.push( h )
  }
  objects.push( block );
}

const ParseBlocklyFile = async ( tab:string, parentBlock, blockJSON, hierarchy:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>, objects ) =>
{

  const block = blocklyToType( blockJSON );
  await ProcessBlocklyBlock( parentBlock, block, hierarchy, objects );

  const inputs = blockJSON.inputs;

  if ( blockJSON.block )
    await ParseBlocklyFile( tab, block, blockJSON.block, hierarchy, objects );

  if ( blockJSON.next )
    await ParseBlocklyFile( tab, block, blockJSON.next.block, hierarchy, objects );

  if ( !inputs )
    return;

  const keys = Object.keys( inputs );
  for ( let i = 0; i < keys.length; i++ )
  {
    const key = keys[i];
    const b/*block*/ = inputs[key];
    await ParseBlocklyFile( tab + '   ', block, b.block, hierarchy, objects );
  }
}

class CommonType {
  id:number; typeId:number; name:string; description:string;orgId:number;
  public compare( obj:CommonType ):boolean
  {
    return obj.id === this.id && obj.typeId === this.typeId && obj.name === this.name && obj.description === this.description && obj.orgId === this.orgId;
  }
}
class Experiment extends CommonType {}
class Server extends CommonType
{
  address:string; method:string; headers:string;
  compare(obj: Server): boolean {
    return super.compare(obj) && obj.address === this.address && obj.method === this.method && obj.headers === this.headers
  }
}
class Collection extends CommonType
{
  batch:number;

  compare(obj: Collection): boolean {
    return super.compare(obj) && obj.batch === this.batch;
  }
}
class Suite extends CommonType
{
  batch:number;
  compare(obj: Suite): boolean {
    return super.compare(obj) && obj.batch === this.batch;
  }
}
class Case extends CommonType {
  batch:number; threads:number; loops:number;
  compare(obj: Case): boolean {
    return super.compare(obj) && obj.batch === this.batch && obj.threads === this.threads && obj.loops === this.loops;
  }
}
class Body extends CommonType {
  json:string;
  compare(obj: Body): boolean {
    return super.compare(obj) && obj.json === this.json;
  }
}
class Test extends CommonType { }
class Replace extends CommonType
{
  json:string;
  compare(obj: Replace): boolean {
    return super.compare(obj) && obj.json === this.json;
  }
}
class Remove extends CommonType
{
  json:string;
  compare(obj: Remove): boolean {
    return super.compare(obj) && obj.json === this.json;
  }
}
class Result extends CommonType
{
  json:string; jsonata:string;
  compare(obj: Result): boolean {
    return super.compare(obj) && obj.json === this.json && obj.jsonata === this.jsonata;
  }
}
class Response extends CommonType
{
  json:string;
  compare(obj: Body): boolean {
    return super.compare(obj) && obj.json === this.json;
  }
}

const compare_Objects = ( a, b ) => {
  if ( a.typeId !== b.typeId ) return true;
  if ( a.id !== b.id ) return true;
  if ( a.name !== b.name ) return true;
  if ( a.description !== b.description ) return true;
  if ( a.orgId !== b.orgId ) return true;
  switch ( a.typeId )
  {
    case SERVER: return a.address !== b.address || a.method !== b.method || a.headers !== b.headers
    case EXPERIMENT:
    case COLLECTION:
    case SUITE:
      return a.batchId !== b.batchId;
    case CASE: return a.batch !== b.batch || a.threads !== b.threads || a.loops !== b.loops;
    case TEST: return false;
    case BODY:
    case REPLACE:
    case REMOVE:
    case RESPONSE:
      return a.json !== b.json;
    case RESULT: return a.json !== b.json || b.jsonata !== b.jsonata;
    default: return true;
  }
}

const blocklyToType = ( blocklyJSON ): Experiment|Server|Collection|Suite|Case|Body|Test|Replace|Remove|Result|Response =>
{
  const getFieldStr = ( name ) => blocklyJSON.fields[name];
  const getFieldInt = ( name ) => parseInt(blocklyJSON.fields[name]);

  const typeId = ObjectNameToTypeLowercase[blocklyJSON['type']];
  let id:number = null;
  if ( blocklyJSON.data )
  {
    const data = JSON.parse( blocklyJSON.data );
    id = data.id;
  }

  switch ( typeId )
  {
    case EXPERIMENT:
    {

      const experiment:Experiment = new Experiment();
      experiment.id = id;
      experiment.typeId = typeId;
      experiment.name = getFieldStr('NAME');
      experiment.description = getFieldStr('DESCRIPTION');
      experiment.orgId = getFieldInt("ORG");
      return experiment;
    }
    case SERVER:
    {
      const server:Server = new Server();
      server.id = id;
      server.typeId = typeId;
      server.name = getFieldStr('NAME');
      server.description = getFieldStr('DESCRIPTION');
      server.address = getFieldStr('ADDRESS');
      server.method = getFieldStr('METHOD');
      server.headers = getFieldStr('HEADERS');
      server.orgId = getFieldInt("ORG");
      return server;
    }
    case COLLECTION:
    {
      const collection:Collection = new Collection();
      collection.id = id;
      collection.typeId = typeId;
      collection.name = getFieldStr('NAME');
      collection.description = getFieldStr('DESCRIPTION');
      collection.batch = getFieldInt('BATCH');
      collection.orgId = getFieldInt("ORG");
      return collection;
    }
    case SUITE:
    {
      const suite:Suite = new Suite();
      suite.id = id;
      suite.typeId = typeId;
      suite.name = getFieldStr('NAME');
      suite.description = getFieldStr('DESCRIPTION');
      suite.batch = getFieldInt('BATCH');
      suite.orgId = getFieldInt("ORG");
      return suite;
    }
    case CASE:
    {
      const cAse:Case = new Case();
      cAse.id = id;
      cAse.typeId = typeId;
      cAse.name = getFieldStr('NAME');
      cAse.description = getFieldStr('DESCRIPTION');
      cAse.orgId = getFieldInt("ORG");
      cAse.batch = getFieldInt('BATCH');
      cAse.threads = getFieldInt('THREADS');
      cAse.loops = getFieldInt('LOOPS');
      return cAse;
    }
    case BODY:
    {
      const body:Body = new Body();
      body.id = id;
      body.typeId = typeId;
      body.name = getFieldStr('NAME');
      body.description = getFieldStr('DESCRIPTION');
      body.orgId = getFieldInt("ORG");
      body.json = getFieldStr('JSON');
      return body;
    }
    case TEST:
    {
      const test:Test = new Test();
      test.id = id;
      test.typeId = typeId;
      test.name = getFieldStr('NAME');
      test.description = getFieldStr('DESCRIPTION');
      test.orgId = getFieldInt("ORG");
      return test;
    }
    case REPLACE:
    {
      const replace:Replace = new Replace();
      replace.id = id;
      replace.typeId = typeId;
      replace.name = getFieldStr('NAME');
      replace.description = getFieldStr('DESCRIPTION');
      replace.orgId = getFieldInt("ORG");
      replace.json = getFieldStr('JSON');
      return replace;
    }
    case REMOVE:
    {
      const remove:Remove = new Remove();
      remove.id = id;
      remove.typeId = typeId;
      remove.name = getFieldStr('NAME');
      remove.description = getFieldStr('DESCRIPTION');
      remove.orgId = getFieldInt("ORG");
      remove.json = getFieldStr('JSON');
      return remove;
    }
    case RESULT:
    {
      const result:Result = new Result();
      result.id = id;
      result.typeId = typeId;
      result.name = getFieldStr('NAME');
      result.description = getFieldStr('DESCRIPTION');
      result.orgId = getFieldInt("ORG");
      result.json = getFieldStr('JSON');
      result.jsonata = getFieldStr('JSONATA');
      return result;
    }
    case RESPONSE:
    {
      const response:Response = new Response();
      response.id = id;
      response.typeId = typeId;
      response.name = getFieldStr('NAME');
      response.description = getFieldStr('DESCRIPTION');
      response.orgId = getFieldInt("ORG");
      response.json = getFieldStr('JSON');
      return response;
    }
    default: throw `UNKNOWN TYPE - ${typeId}`;
  }
  // console.log( blocklyBlock.type, typeId );
}
