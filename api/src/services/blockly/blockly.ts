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
import {createQaObject, qaObject} from "src/services/qaObjects/qaObjects";
import {db} from "src/lib/db";

export const addBlockly = async ( { blocklyJsonOld, blocklyJsonNew } ) =>
{
  const hierarchyNew:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>  = [];
  const objectsNew    = [];
  const jsonWorkspaceNew = JSON.parse( blocklyJsonNew );
  const blocksNew = jsonWorkspaceNew.blocks.blocks;
  await blocksNew.map( async block => {
    await ParseBlocklyFile( ' ', null, block, hierarchyNew, objectsNew );
  });

  const hierarchyOld:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>  = [];
  const objectsOld    = [];
  const jsonWorkspaceOld = JSON.parse( blocklyJsonOld );
  const blocksOld = jsonWorkspaceOld.blocks.blocks;
  await blocksOld.map( async block => {
    await ParseBlocklyFile( ' ', null, block, hierarchyOld, objectsOld );
  });

  objectsNew.map( objectNew => {
    const objectOld = objectsOld.find(o => o.id === objectNew.id);
    // console.log(objectNew);
    if (!objectOld)
      return;
    console.log(objectOld);
  });

  hierarchyOld.map( async h => {
    const hNew = hierarchyNew.find( hn => hn.parentId === h.parentId && hn.childrenId === h.childrenId && hn.childrenObjectTypeId === h.childrenObjectTypeId )
    if ( hNew )
      return;

    await db.qaObjectRelationship.deleteMany({
      where: {
        AND: [
          {
            parentId: {
              equals: h.parentId
            }
          },
          {
            childrenId: {
              equals: h.childrenId
            }
          },
          {
            childrenObjectTypeId: {
              equals: h.childrenObjectTypeId
            }
          }
        ]
      }
    });

  } );

  hierarchyNew.map( async h => {
    const hOld = hierarchyNew.find(hn => hn.parentId === h.parentId && hn.childrenId === h.childrenId && hn.childrenObjectTypeId === h.childrenObjectTypeId)
    if ( hOld )
      return;

    // TODO: create new relationship
  });

  return 1;
}

const ProcessBlocklyBlock = async ( parentBlock, block, hierarchy:Array<{parentId:number,childrenId:number,childrenObjectTypeId:number}>, objects  ) =>
{
  console.log( 'parent', parentBlock, 'child', block );
  if ( !block.id )
  {
    // const newObject = await db.qaObject.create( { data: block } );
    // block.id = newObject.id;
  }

  if ( parentBlock )
  {
    hierarchy.push( {parentId:parentBlock.id, childrenId:block.id, childrenObjectTypeId: block.typeId })
  }
  objects.push( block );

  // const data = block.data;
  // console.log( tab, block );
  // console.log( tab, 'parentBlock', parentBlock,'block', block );
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

  Object.keys( inputs ).map( async key =>
  {
    const b/*block*/ = inputs[key];
    // console.log( b.block );
    await ParseBlocklyFile( tab + '   ', block, b.block, hierarchy, objects );
  });
}

class CommonType {
  id:number; typeId:number; name:string; description:string;
  public compare( obj:CommonType ):boolean
  {
    return obj.id === this.id && obj.typeId === this.typeId && obj.name === this.name && obj.description === this.description;
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
      return suite;
    }
    case CASE:
    {
      const cAse:Case = new Case();
      cAse.id = id;
      cAse.typeId = typeId;
      cAse.name = getFieldStr('NAME');
      cAse.description = getFieldStr('DESCRIPTION');
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
      return test;
    }
    case REPLACE:
    {
      const replace:Replace = new Replace();
      replace.id = id;
      replace.typeId = typeId;
      replace.name = getFieldStr('NAME');
      replace.description = getFieldStr('DESCRIPTION');
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
      response.json = getFieldStr('JSON');
      return response;
    }
    default: throw `UNKNOWN TYPE - ${typeId}`;
  }
  // console.log( blocklyBlock.type, typeId );
}
