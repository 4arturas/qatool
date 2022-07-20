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
import {qaObject, updateQaObject} from "src/services/qaObjects/qaObjects";
import {qaObjectRelationships} from "src/services/qaObjectRelationships/qaObjectRelationships";

export const runExperiment = async ({experimentId}) =>
{
  const generateResponse = ( error ): any => {
    return { experimentId: experimentId, error: error };
  }

  const experimentWasExecutedMessage: string = 'This experiment was already executed, you can not execute experiment more than once';
  const qaObjectExecuted = await QaObject.findBy( { id: experimentId, executed: true } );
  if ( qaObjectExecuted )
  {
    return generateResponse( experimentWasExecutedMessage );
  }

  const experiments = await ExperimentResult.where( { experimentId: experimentId } );
  if ( experiments.length )
  {
    return generateResponse( experimentWasExecutedMessage );
  }

  const promises = [];
  try {
    const serverANDsuitesRelations = await QaObjectRelationship.where({parentId: experimentId});
    let childrenIdArray = serverANDsuitesRelations.flatMap(f => f.childrenId);
    const serverANDcollection = await db.qaObject.findMany({
      where: {
        id: {in: childrenIdArray},
        typeId: {in: [SERVER, COLLECTION]}
      }
    });
    const server = serverANDcollection.find(s => s.typeId === SERVER);
    const collection = serverANDcollection.find(c => c.typeId === COLLECTION);


    const suitesBelongingToCollection = await QaObjectRelationship.where({parentId: collection.id});
    const suitesBelongingToCollectionChildrenId = suitesBelongingToCollection.flatMap(c => c.childrenId);
    const suites = await db.qaObject.findMany({
      where: {
        id: {in: suitesBelongingToCollectionChildrenId},
        typeId: {equals: SUITE}
      }
    });
    for (let s = 0; s < suites.length; s++) {
      const suite = suites[s];
      const suiteChildren = await QaObjectRelationship.where({parentId: suite.id});
      const suiteChildrenId = suiteChildren.flatMap(c => c.childrenId);
      const cases = await db.qaObject.findMany({where: {id: {in: suiteChildrenId}, typeId: {equals: CASE}}});
      for (let c = 0; c < cases.length; c++) {
        const cAse = cases[c];
        const caseChildrenRelations = await QaObjectRelationship.where({parentId: cAse.id});
        const caseChildrenId = caseChildrenRelations.flatMap(c => c.childrenId);
        const bodyANDtest = await db.qaObject.findMany({where: {id: {in: caseChildrenId}, typeId: {in: [BODY, TEST]}}});
        const body = bodyANDtest.find(b => b.typeId === BODY);
        const test = bodyANDtest.find(t => t.typeId === TEST);

        const testChildren = await QaObjectRelationship.where({parentId: test.id});
        const testChildrenId = testChildren.flatMap(t => t.childrenId);
        const replaceRemoveResultResponse = await db.qaObject.findMany({
          where: {
            id: {in: testChildrenId},
            typeId: {in: [REPLACE, REMOVE, RESULT, RESPONSE]}
          }
        });
        const replace = replaceRemoveResultResponse.find(r => r.typeId === REPLACE);
        const remove = replaceRemoveResultResponse.find(r => r.typeId === REMOVE);
        const result = replaceRemoveResultResponse.find(r => r.typeId === RESULT);
        const response = replaceRemoveResultResponse.find(r => r.typeId === RESPONSE);

        let counter = 0;
        for (let thread = 0; thread < cAse.threads; thread++) {
          const promise = new Promise(async (resolve, reject) => {
            const loopArray = [];
            for (let loop = 0; loop < cAse.loops; loop++) {

              const paymentId:string = generatePaymentId(collection, suite, cAse, counter++);
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
                type:             MSG_OUTGOING,
                experimentId:     experimentId,
                collectionId:     collection.id,
                suiteId:          suite.id,
                caseId:           cAse.id,
                thread:           thread,
                loop:             loop,
                paymentId:        paymentId,
                request:          JSON.stringify(changedBody),
                response:         JSON.stringify(responseJSon),
                requestDate:      requestDate.toISOString(),
                responseDate:     responseDate.toISOString(),
                status:           res.status,
                statusText:       res.statusText,
                txnId:            responseJSon?.txnId,
                jsonata:          result.jsonata
              };
              loopArray.push( messageOutgoing );

              // const messageIncoming = messageOutgoing.txnId && await Message.first({txnId: messageOutgoing.txnId});

            } // end for loop
            resolve( loopArray );
          }); // end Promise
          promises.push( promise );
        } // end for thread

      } // end for case
    } // end for suite

    await Promise.all( promises ).then( async results => {
      for ( let i = 0; i < results.length; i++ )
      {
        const loopArray = results[i];
        for ( let j = 0; j < loopArray.length; j++ )
        {
          const messageOutgoing = loopArray[j];
          const dbResult = await createExperimentResult({
            input: messageOutgoing
          });
        }
      }
    });

    const experiment = await QaObject.find( experimentId );
    await experiment.update({ executed: true })

    return generateResponse(null);
  }
  catch ( e )
  {
    return generateResponse( e.message );
  }
}

async function makeCall(url, method, headers, data) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
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
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

const generatePaymentId = ( collection, suite, cAse, counter:number ):string =>
{
  // const prefix = 'QA-OUT';
  const random = getRandomIntInclusive(1000,9999);
  // return `${prefix}-${new Date().getTime()}-${random}-${collection.batchId}-${suite.batchId}-${cAse.batchId}-${counter}`;
  return `${random}-${collection.batchId}-${suite.batchId}-${cAse.batchId}-${counter}`;
}

const merge = (paymentId:string, body, replace, remove) =>
{
  if (body['paymentId'])
    replace.paymentId = paymentId;
  else
    replace.paymentNo = paymentId;

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
