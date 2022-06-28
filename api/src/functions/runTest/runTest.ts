import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import {db} from "src/lib/db";
import {generatePaymentId, MSG_OUTGOING} from "../global";
import {createMessage} from "src/services/messages/messages";
import {Message} from "src/models";

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
export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked runTest function')

  const bodyRequest   = JSON.parse(event.body);
  const serverId      = bodyRequest.server;
  const bodyId        = bodyRequest.body;
  const testId        = bodyRequest.test;
  const replaceId     = bodyRequest.replace;
  const removeId      = bodyRequest.remove;
  const resultId      = bodyRequest.result;

  const server        = await db.qaObject.findUnique({where: {id:serverId}});
  const body          = await db.qaObject.findUnique({where: {id:bodyId}});
  const test          = await db.qaObject.findUnique({where: {id:testId}});
  const replace       = await db.qaObject.findUnique({where: {id:replaceId}});
  const remove        = await db.qaObject.findUnique({where: {id:removeId}});
  const result        = await db.qaObject.findUnique({where: {id:resultId}});

  const changedBody   = merge( JSON.parse(body.json), JSON.parse(replace.json), JSON.parse(remove.json) );

  try
  {
    const requestDate: Date = new Date();
    const response = await postData(server.address, JSON.parse(server.header), changedBody);
    const responseDate: Date = new Date();

    const responseJSon = await response.json();

    const messageOutgoing = {
      type:           MSG_OUTGOING,
      request:        JSON.stringify(changedBody),
      response:       JSON.stringify(responseJSon),
      requestDate:    requestDate.toISOString(),
      responseDate:   responseDate.toISOString(),
      httpCode:       response.status,
      txnId:          responseJSon?.txnId,
      jsonata:        result.jsonata
    };

    const dbResult = await createMessage({
      input: messageOutgoing
    });

    const messageIncoming = messageOutgoing.txnId && await Message.first({txnId:messageOutgoing.txnId});

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          messageOutgoing: messageOutgoing,
          messageIncoming: messageIncoming
        },
      }),
    }
  }
  catch ( e )
  {
    throw e;
  }

}

async function postData(url, headers, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

const merge = (body, replace, remove) =>
{
  replace.paymentId = generatePaymentId('QA-OUT');
  Object.keys(replace).map( (r) => body[r] = replace[r] );

  remove.map( (r) => delete body[r] );

  return body;
}
