import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import {CreateExperimentResultInput} from "types/graphql";
import {MSG_INCOMING} from "src/functions/global";
import {createExperimentResult} from "src/services/experimentResults/experimentResults";

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
  logger.info('Invoked SettleIncomingPayment function')

  const body = event.body;
  const bodyJSON = JSON.parse(body);
  const paymentId:string = bodyJSON.paymentId;

  const message:CreateExperimentResultInput = {
    type:         MSG_INCOMING,
    experimentId: null,
    collectionId: null,
    suiteId:      null,
    caseId:       null,
    thread:       null,
    loop:         null,
    paymentId:    paymentId,
    request:      null,
    response:     event.body,
    requestDate:  null,
    responseDate: new Date().toISOString(),
    txnId:        null
  }

  const dbResult = await createExperimentResult({
    input: message
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'settleIncomingPayment function',
    }),
  }
}
