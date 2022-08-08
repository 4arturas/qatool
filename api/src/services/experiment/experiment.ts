import {ExperimentResult, QaObject, QaObjectRelationship} from "src/models";
import {db} from "src/lib/db";
import {
  BODY,
  CASE,
  COLLECTION, getRandomIntInclusive,
  MSG_OUTGOING,
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
import * as https from "https";

export const runExperiment = async ({experimentId, delay}) =>
{
  const generateResponse = ( error ): any => {
    return { experimentId: experimentId, error: error };
  }

  const experimentWasExecutedMessage: string = 'This experiment was already executed, you can not execute experiment more than once';
  const qaObjectExecuted = await QaObject.findBy( { id: experimentId } );
  if ( qaObjectExecuted.executed )
  {
    return generateResponse( experimentWasExecutedMessage );
  }

  const experiments = await ExperimentResult.where( { experimentId: experimentId } );
  if ( experiments.length )
  {
    return generateResponse( experimentWasExecutedMessage );
  }
  const errors = [];
  try {
    await setExecuted( experimentId );
    const serverANDsuitesRelations = await QaObjectRelationship.where({parentId: experimentId});
    let childrenIdArray = serverANDsuitesRelations.flatMap(f => f.childrenId);
    const serverANDcollection = await db.qaObject.findMany({
      where: {
        id: {in: childrenIdArray},
        typeId: {in: [SERVER, COLLECTION]}
      }
    });
    const server = serverANDcollection.find(s => s.typeId === SERVER);
    await setExecuted( server.id );
    const collections = serverANDcollection.filter(c => c.typeId === COLLECTION);

    for ( let c = 0; c < collections.length; c++ )
    {
      const collection = collections[c];
      await setExecuted( collection.id );
      const suitesBelongingToCollection = await QaObjectRelationship.where({parentId: collection.id});
      const suitesBelongingToCollectionChildrenId = suitesBelongingToCollection.flatMap(c => c.childrenId);
      const suites = await db.qaObject.findMany({
        where: {
          id: {in: suitesBelongingToCollectionChildrenId},
          typeId: {equals: SUITE}
        }
      });
      for (let s = 0; s < suites.length; s++)
      {
        const suite = suites[s];
        await setExecuted( suite.id );
        const suiteChildren = await QaObjectRelationship.where({parentId: suite.id});
        const suiteChildrenId = suiteChildren.flatMap(c => c.childrenId);
        const cases = await db.qaObject.findMany({where: {id: {in: suiteChildrenId}, typeId: {equals: CASE}}});
        for (let ca = 0; ca < cases.length; ca++)
        {
          const cAse = cases[ca];
          await setExecuted( cAse.id );
          const caseChildrenRelations = await QaObjectRelationship.where({parentId: cAse.id});
          const caseChildrenId = caseChildrenRelations.flatMap(c => c.childrenId);
          const bodyANDtest = await db.qaObject.findMany({
            where: {
              id: {in: caseChildrenId},
              typeId: {in: [BODY, TEST]}
            }
          });

          const body = bodyANDtest.find(b => b.typeId === BODY);
          await setExecuted( body.id );
          const testArr = bodyANDtest.filter(t => t.typeId === TEST);
          for (let tIdx = 0; tIdx < testArr.length; tIdx++)
          {
            const test = testArr[tIdx];
            await setExecuted( test.id );
            const testChildren = await QaObjectRelationship.where({parentId: test.id});
            const testChildrenId = testChildren.flatMap(t => t.childrenId);
            const replaceRemoveResultResponse = await db.qaObject.findMany({
              where: {
                id: {in: testChildrenId},
                typeId: {in: [REPLACE, REMOVE, RESULT, RESPONSE]}
              }
            });
            const replace = replaceRemoveResultResponse.find(r => r.typeId === REPLACE);
            await setExecuted( replace.id );
            const remove = replaceRemoveResultResponse.find(r => r.typeId === REMOVE);
            await setExecuted( remove.id );
            const result = replaceRemoveResultResponse.find(r => r.typeId === RESULT);
            await setExecuted( result.id );
            const response = replaceRemoveResultResponse.find(r => r.typeId === RESPONSE);
            await setExecuted( response.id );

            let counter = 0;

            for (let thread = 0; thread < cAse.threads; thread++)
            {
              // DELAY
              setTimeout ( () => {
                console.log( 'WORKING...' );
                const promise = new Promise(async (resolve, reject) => {
                  for (let loop = 0; loop < cAse.loops; loop++) {
                    try {
                      const paymentId: string = generatePaymentId(collection, suite, cAse, counter++);
                      const changedBody = merge(paymentId, JSON.parse(body.json), JSON.parse(replace.json), JSON.parse(remove.json));


                      const requestDate: Date = new Date();
                      // const response = await postData(server.address, JSON.parse(server.header), changedBody);
                      const res = await makeCall(server.address, server.method, JSON.parse(server.header), changedBody);
                      const responseDate: Date = new Date();

                      let responseJSon: any;
                      try {
                        responseJSon = await res.json();
                      } catch (e) {
                        responseJSon = null;
                      }

                      const messageOutgoing = {
                        type: MSG_OUTGOING,
                        experimentId: experimentId,
                        collectionId: collection.id,
                        suiteId: suite.id,
                        caseId: cAse.id,
                        testId: test.id,
                        thread: thread,
                        loop: loop,
                        paymentId: paymentId,
                        request: JSON.stringify(changedBody),
                        response: JSON.stringify(responseJSon),
                        requestDate: requestDate.toISOString(),
                        responseDate: responseDate.toISOString(),
                        status: res.status,
                        statusText: res.statusText,
                        txnId: responseJSon?.txnId,
                        jsonata: result.jsonata
                      };
                      const dbResult = await createExperimentResult({
                        input: messageOutgoing
                      });

                      // const messageIncoming = messageOutgoing.txnId && await Message.first({txnId: messageOutgoing.txnId});
                    } catch (e) {
                      // errors.push(e);
                    }
                  } // end for loop

                }); // end Promise
              }, (c/*collection*/+s/*suite*/ + ca/*case*/+thread) * delay );
              // DELAY
            } // end for thread
          } // end for test
        } // end for case
      } // end for suite
    } // end for collection


/*    if ( errors.length > 0 )
    {
      let err = '';
      errors.map( e => { err += `${e.message}\n` } );
      return generateResponse( err );
    }*/

    return generateResponse(null);
  }
  catch ( e )
  {
    return generateResponse( e.message );
  }
}

const setExecuted = async ( id:number ) =>
{
  await db.qaObject.update({
    data: { executed: new Date().toISOString() },
    where: { id }
  });
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
async function makeCall(url, method, headers, data) {
  // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
    agent: httpsAgent
  } );
  return response; // parses JSON response into native JavaScript objects
}

const generatePaymentId = ( collection, suite, cAse, counter:number ):string =>
{
  // const prefix = 'QA-OUT';
  const random = getRandomIntInclusive(1000,9999);
  // return `${prefix}-${new Date().getTime()}-${random}-${collection.batchId}-${suite.batchId}-${cAse.batchId}-${counter}`;
  return `${random}-${collection.batchId}-${suite.batchId}-${cAse.batchId}-${counter}`;
}

function process(key,value) {
  // console.log(key + " : "+value);
}
function traverse( o, func, paymentId )
{
  for (let i in o) {
    if ( i === 'paymentId' || i === 'paymentNo' )
    {
      o[i] = paymentId;
    }
    func.apply(this,[i,o[i]]);
    if (o[i] !== null && typeof(o[i])=="object") {
      //going one step down in the object tree!!
      traverse( o[i], func, paymentId );
    }
  }
}

const merge = (paymentId:string, body, replace, remove) =>
{
  traverse( body, process, paymentId );

  Object.keys(replace).map( (r) => body[r] = replace[r] );

  remove.map( (r) => delete body[r] );

  return body;
}

export const findExperiment = async ( { id: id } ) =>
{
  // let data: { parent: any; children: any[] };
  let rel = [];
  // await getRelations( id, rel ); // TODO: fetch only objects belonging to the experiment
  rel = await qaObjectRelationships();

  const arrParentId = rel.flatMap( i => i.parentId );
  const arrChildrenId = rel.flatMap( i => i.childrenId );
  arrParentId.push(...arrChildrenId);
  const idArray = Array.from(new Set(arrParentId));

  const objects = db.qaObject.findMany( { where: { id: { in: idArray } } } );
  return {
    experimentId: id,
    relations: rel,
    objects: objects
  };
}

export const runBrowserExperiment = async ({testId, thread, loop}) =>
{
  console.log( 'runBrowserExperiment' );

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const requestDate: Date = new Date();

  const delayTime = getRandomIntInclusive( 0, 5000);
  console.log( 'delayTime', delayTime );
  await delay(delayTime);
  const responseDate: Date = new Date();


  const experimentId = null;
  const collectionId = null;
  const suiteId = null;
  const caseId = null;
  const paymentId = null;
  const messageOutgoing = {
    type: MSG_OUTGOING,
    experimentId: experimentId,
    collectionId: collectionId,
    suiteId: suiteId,
    caseId: caseId,
    testId: testId,
    thread: thread,
    loop: loop,
    paymentId: paymentId,
    request: '_JSON$stringify(changedBody)',
    response: '_JSON$stringify(responseJSon)',
    requestDate: requestDate.toISOString(),
    responseDate: responseDate.toISOString(),
    status: 200,
    statusText: 'OK',
    txnId: null,
    jsonata: null
  };

  return {
    testId: testId, thread: thread, loop: loop,

    type: MSG_OUTGOING,
    paymentId: 1,
    request: 'request',
    response: 'response',
    requestDate: requestDate.toISOString(),
    responseDate: responseDate.toISOString(),
    jsonata: '',
    txnId: '111'
  }

}

export const runBrowserExperimentDemo = async ({testId, thread, loop}) =>
{
  console.log( 'runBrowserExperimentDemo' );

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const requestDate: Date = new Date();

  const delayTime = getRandomIntInclusive( 0, 5000);
  console.log( 'delayTime', delayTime );
  await delay(delayTime);
  const responseDate: Date = new Date();


  const experimentId = null;
  const collectionId = null;
  const suiteId = null;
  const caseId = null;
  const paymentId = null;
  const messageOutgoing = {
    type: MSG_OUTGOING,
    experimentId: experimentId,
    collectionId: collectionId,
    suiteId: suiteId,
    caseId: caseId,
    testId: testId,
    thread: thread,
    loop: loop,
    paymentId: paymentId,
    request: '_JSON$stringify(changedBody)',
    response: '_JSON$stringify(responseJSon)',
    requestDate: requestDate.toISOString(),
    responseDate: responseDate.toISOString(),
    status: 200,
    statusText: 'OK',
    txnId: null,
    jsonata: null
  };

  return {
    testId: testId, thread: thread, loop: loop,

    type: MSG_OUTGOING,
    paymentId: 1,
    request: 'request',
    response: 'response',
    requestDate: requestDate.toISOString(),
    responseDate: responseDate.toISOString(),
    jsonata: '',
    txnId: '111'
  }

}
