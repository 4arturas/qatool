import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
class QaObj {
  id: number;
  relationshipId: number;
  typeId: number;
  parentId: number;
  name: string;
  children: Array<QaObj>;
}

let tmpQaObjects:Array<any> = [];

const buildTree = async ( tree:QaObj ): Promise<QaObj> => {

  /*let exists: qaObjects = tmpQaObjects.find( (e) => e.id === tree.id );
  if ( !exists )
  {*/
    const exists = await db.qaObject.findUnique( {where: { id: tree.id } });
    /*tmpQaObjects.push( exists );
  }*/

  tree.name = exists.name;
  tree.typeId = exists.typeId;

  const resultset = await db.qaObjectRelationship.findMany( { where: { parentId:tree.id } } );

  for ( let i = 0; i < resultset.length; i++ )
  {
    const r = resultset[i];
    const root: QaObj = {id: r.childrenId, relationshipId: r.id, typeId:null, parentId: tree.id, name: null, children: []};
    tree.children.push( root );
    await buildTree( root );
  }
  return tree;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked relationshipTree function')

  const id:number = parseInt(event.queryStringParameters.id);

  const root: QaObj = {id: id, relationshipId: null, typeId: null, parentId: null, name: null, children: []};
  const tree = await buildTree( root );
  // console.log( tree );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: tree,
    }),
  }
}
