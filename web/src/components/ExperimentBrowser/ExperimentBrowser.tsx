import {
  CASE,
  COLLECTION,
  EXPERIMENT,
  getRandomIntInclusive,
  SUITE,
  TEST,
  typeIdToColor,
  typeIdToName
} from "src/global";
import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, Segmented, Spin, Tag, Tooltip} from "antd";
import {useApolloClient} from "@apollo/client";
import {BorderOutlined, PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import ReactDOM from "react-dom";

const RUN_BROWSER_EXPERIMENT = gql`
          query RunBrowserExperiment($testId: Int!, $thread: Int!, $loop: Int!) {
            runBrowserExperiment(testId: $testId, thread: $thread, loop: $loop) {
              testId thread loop requestTime
            }
          }
        `;

interface ApiCallObject
{
  collectionId: number,
  suiteId: number,
  caseId: number,
  testId: number,
  thread: number,
  loop: number,
  num: number,
  wait: boolean
}

const ExperimentBrowser = ( { qaObject, objects, hierarchy } ) => {

  const client = useApolloClient();
  const [apiObjects, setApiObjects] = useState([]);

  if ( qaObject.typeId !== EXPERIMENT ) return <></>

  const EXPERIMENT_EXECUTION_MODE_PLAY = 'Play';
  const EXPERIMENT_EXECUTION_MODE_PAUSE = 'Pause';
  const EXPERIMENT_EXECUTION_MODE_STOP = 'Stop';
  const EXPERIMENT_EXECUTION_MODE_DONE = 'Done';

  const [experimentExecutionMode, setExperimentExecutionMode] = useState( EXPERIMENT_EXECUTION_MODE_STOP );

  const RUN_MODE_QUEUE = 'Queue';
  const RUN_MODE_THREADS = 'Threads';
  const RUN_MODE_THREADS_QUEUE = 'Threads Queue';
  const RUN_MODE_RANDOM = 'Random';
  const [runMode, setRunMode] = useState(RUN_MODE_THREADS);

  function delayFunction(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  const [delayMS, setDelayMS] = useState( 1000 );

  const SLEEP_MODE_NORMAL = 'Normal';
  const SLEEP_MODE_RANDOM = 'Random';
  const [sleepMode, setSleepMode] = useState(SLEEP_MODE_NORMAL);

  const set_RUN_MODE_QUEUE = ():Array<ApiCallObject> =>
  {
    let num = 0;
    const tmpApiObjectsArr:Array<ApiCallObject> = [];
    const tests = objects.filter( o => o.typeId === TEST );
    tests.map( test => {
      const caseId = hierarchy.find(h => h.childrenId === test.id).parentId;
      const suiteId = hierarchy.find(h => h.childrenId === caseId).parentId;
      const collectionId = hierarchy.find(h => h.childrenId === suiteId).parentId;
      const cAse = objects.find( o => o.id === caseId );
      for (let thread = 0; thread < cAse.threads; thread++) {
        for (let loop = 0; loop < cAse.loops; loop++) {
          const apiCallObject: ApiCallObject = {
            collectionId: collectionId,
            suiteId: suiteId,
            caseId: caseId,
            testId: test.id,
            thread: thread,
            loop: loop,
            num: num++,
            wait: true
          };
          tmpApiObjectsArr.push(apiCallObject);
        }
      }
    });
    return tmpApiObjectsArr;
  }

  const set_RUN_MODE_THREADS = ():Array<ApiCallObject> =>
  {
    let num = 0;
    const tmpApiObjectsArr:Array<ApiCallObject> = [];
    const cases = objects.filter( o => o.typeId === CASE );
    const maxThreads = Math.max(...cases.map( c => c.threads ) );
    const maxLoops = Math.max(...cases.map( c => c.loops ) );

    for ( let loop = 0; loop < maxLoops; loop++ )
    {
      let apiCallObject: ApiCallObject;
      for ( let thread = 0; thread < maxThreads; thread++ )
      {
        cases.map( cAse => {
          if ( loop < cAse.loops && thread < cAse.threads )
          {
            const suiteId = hierarchy.find(h => h.childrenId === cAse.id).parentId;
            const collectionId = hierarchy.find(h => h.childrenId === suiteId).parentId;
            const testsIds = hierarchy.filter( h => h.parentId === cAse.id && h.childrenObjectTypeId === TEST ).map( m => m.childrenId );
            testsIds.map( testId => {
              const test = objects.find( o => o.id === testId );
              apiCallObject = {
                collectionId: collectionId,
                suiteId: suiteId,
                caseId: cAse.id,
                testId: test.id,
                thread: thread,
                loop: loop,
                num: num++,
                wait: false
              };
              tmpApiObjectsArr.push(apiCallObject);
            });

          } // end if
        });
      } // end for thread
      apiCallObject.wait = true;
    } // end for loop

    return tmpApiObjectsArr;
  }

  const set_RUN_MODE_THREADS_QUEUE = ():Array<ApiCallObject> =>
  {
    let num = 0;
    const tmpApiObjectsArr:Array<ApiCallObject> = [];
    const cases = objects.filter( o => o.typeId === CASE );
    const maxThreads = Math.max(...cases.map( c => c.threads ) );
    const maxLoops = Math.max(...cases.map( c => c.loops ) );

    for ( let thread = 0; thread < maxThreads; thread++ )
    {
      for ( let loop = 0; loop < maxLoops; loop++ )
      {
        cases.map( cAse => {
          if ( loop < cAse.loops && thread < cAse.threads )
          {
            const suiteId = hierarchy.find(h => h.childrenId === cAse.id).parentId;
            const collectionId = hierarchy.find(h => h.childrenId === suiteId).parentId;
            const testsIds = hierarchy.filter( h => h.parentId === cAse.id && h.childrenObjectTypeId === TEST ).map( m => m.childrenId );
            testsIds.map( testId => {
              const test = objects.find( o => o.id === testId );
              const apiCallObject: ApiCallObject = {
                collectionId: collectionId,
                suiteId: suiteId,
                caseId: cAse.id,
                testId: test.id,
                thread: thread,
                loop: loop,
                num: num++,
                wait: false
              };
              tmpApiObjectsArr.push(apiCallObject);
            });
          } // end if
        });
      } // end for thread
    } // end for loop
    return tmpApiObjectsArr;
  }

  const set_RUN_MODE_RANDOM = ():Array<ApiCallObject> =>
  {
    const tmpApiObjectsArr:Array<ApiCallObject> = set_RUN_MODE_QUEUE();
    const newApiObjectsArr:Array<ApiCallObject> = [];
    let num = 0;
    while ( tmpApiObjectsArr.length > 0 )
    {
      const idx = getRandomIntInclusive( 0, tmpApiObjectsArr.length-1 );
      const apiCallObject:ApiCallObject = tmpApiObjectsArr[idx];
      apiCallObject.num = num++;
      newApiObjectsArr.push( apiCallObject );
      tmpApiObjectsArr.splice( idx, 1 );
    }
    return newApiObjectsArr;
  }

  const createKey = ( apiCallObject:ApiCallObject ): string =>
  {
    return `span${apiCallObject.collectionId}${apiCallObject.suiteId}${apiCallObject.caseId}${apiCallObject.testId}${apiCallObject.thread}${apiCallObject.loop}`;
  }
  const getSpan = ( apiCallObject:ApiCallObject ) =>
  {
    return document.getElementById(createKey(apiCallObject));
  }
  const toString = ( apiCallObject:ApiCallObject ): any =>
  {
    // return `<b>Collection</b>${apiCallObject.collectionId} <b>Suite</b>${apiCallObject.suiteId} <b>Case</b>${apiCallObject.caseId} <b>Test</b>${apiCallObject.testId} <b>Thread</b>${apiCallObject.thread} <b>Loop</b>${apiCallObject.loop} <b>Num</b>${apiCallObject.num}`;
    return `<b>Num: </b>${apiCallObject.num}`;
  }

  const spanStatus = ( apiCallObject:ApiCallObject ) =>
  {
    const span = getSpan( apiCallObject );
    span.innerHTML = `${toString(apiCallObject)}`;
    span.style.backgroundColor = `white`;
  }



  useEffect(() => {
    const tmpApiObjectsArr = set_RUN_MODE_THREADS();
    setApiObjects( tmpApiObjectsArr );
    tmpApiObjectsArr.map( ( apiCallObject:ApiCallObject ) => {
      spanStatus( apiCallObject );
    });
  }, []);

  async function spanSleeping(id:string, thread:number, loop:number)
  {
    const delayTime = (sleepMode===SLEEP_MODE_NORMAL) ? delayMS : getRandomIntInclusive( 0, delayMS );

    const span = document.getElementById(id);
    span.style.backgroundColor = 'yellow';
    span.style.color = 'black';

    const intervalDelay = 100;
    let showDelay = delayTime;
    const interval = setInterval( () => {
      span.innerHTML = `SLEEPING - ${showDelay}ms  thread=${thread} loop=${loop}`;
      showDelay -= intervalDelay;
      if ( showDelay < 0 )
        clearInterval( interval );
    }, intervalDelay );

    await delayFunction(delayTime);
    clearInterval( interval );
  }

  const spanWorking = ( id, text:string, thread:number, loop:number) =>
  {
    const span = document.getElementById(id);
    span.innerHTML = `WORKING with testId=${text} thread=${thread} loop=${loop}`;
    span.style.backgroundColor = 'lightblue';
    span.style.color = 'black';
    // ReactDOM.render(<div><Spin size={'small'} /> WORKING with testId={text} thread={thread} loop={loop}</div>, span);
  }

  const spanDone = ( id, testId, text, thread:number, loop:number ) =>
  {
    const span = document.getElementById(id);
    span.innerHTML = `DONE testId=${testId} server request time=${text} thread=${thread} loop=${loop}`;
    span.style.backgroundColor = 'lightgreen';
    span.style.color = 'black';
  }

  const spanError = ( id, text, thread:number, loop:number) =>
  {
    const span = document.getElementById(id);
    span.innerHTML = `ERROR=${text} thread=${thread} loop=${loop}`;
    span.style.backgroundColor = 'red';
    span.style.color = 'black';
  }

  let requestsLeftToRun = 0;
  const [abortControllerArr, setAbortControllerArr] = useState( [] );
  const run = async () =>
  {
    // setAbortControllerArr( [] );
    let promises = [];
    for ( let i = 0; i < apiObjects.length; i++ )
    {
      const apiCallObject:ApiCallObject = apiObjects[i];
      const key = createKey( apiCallObject );
      const cancel = new AbortController();
      abortControllerArr.push( cancel );
      const p = new Promise( async (resolve, reject) => {
        let abortHandler = () => {
          reject( 'Aborted' );
        };
        cancel.signal.addEventListener( 'abort',  abortHandler );
          await apiCall( key, apiCallObject.testId, apiCallObject.thread, apiCallObject.loop );
        resolve( 1 );
      });
      promises.push( p );
      if ( apiCallObject.wait )
      {
        await Promise.all( promises );
        promises = [];
      }
    }

  }

  const apiCall = async ( key, paramTestId, thread, loop ) =>
  {
    // if ( experimentExecutionMode === EXPERIMENT_EXECUTION_MODE_STOP ) return;
    requestsLeftToRun--;
    if ( requestsLeftToRun < 0 )
      return;

    await spanSleeping(key, thread, loop);
    spanWorking(key, paramTestId, thread, loop);

    client.query({
      query: RUN_BROWSER_EXPERIMENT,
      variables: {testId:paramTestId, thread: thread, loop: loop }
    })
    .then( data => {
      const runBrowserExperiment = data.data.runBrowserExperiment;
      // console.log( data.data.runBrowserExperiment );
      spanDone(key, runBrowserExperiment.testId, runBrowserExperiment.requestTime, runBrowserExperiment.thread, runBrowserExperiment.loop);
      if ( requestsLeftToRun <= 0 )
        setExperimentExecutionMode( EXPERIMENT_EXECUTION_MODE_DONE );
    })
    .catch( e => {
      spanError(key,e.message, thread, loop);
      if ( requestsLeftToRun <= 0 )
        setExperimentExecutionMode( EXPERIMENT_EXECUTION_MODE_DONE );
    } );

  }

  const stylingObject = {
    loop: {
      border:'1px solid green', display:'inline-block', textAlign:'left', paddingLeft:'5px'
    },
    play: {
      marginLeft:'10px', fontSize: '30px', cursor: 'pointer'
    },
    pause: {
      marginLeft:'10px', fontSize: '30px', cursor: 'pointer'
    },
    stop: {
      marginLeft:'10px', fontSize: '30px', cursor: 'pointer'
    },
  }

  return <>
      <span style={{marginLeft:'20px'}}>
        <b>Run mode: </b>
        <Segmented
          options={[RUN_MODE_QUEUE, RUN_MODE_THREADS, RUN_MODE_THREADS_QUEUE, RUN_MODE_RANDOM]}
          defaultValue={runMode}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          style={{backgroundColor:'darkgray'}}
          onChange={ (e) => {
            setRunMode(e);
            let tmpApiObjectsArr:Array<ApiCallObject>;
            switch ( e )
            {
              case RUN_MODE_QUEUE:
                tmpApiObjectsArr = set_RUN_MODE_QUEUE();
                break;

              case RUN_MODE_THREADS:
                tmpApiObjectsArr = set_RUN_MODE_THREADS();
                break;

              case RUN_MODE_THREADS_QUEUE:
                tmpApiObjectsArr = set_RUN_MODE_THREADS_QUEUE();
                break;

              case RUN_MODE_RANDOM:
                tmpApiObjectsArr = set_RUN_MODE_RANDOM();
                break;
            }


            tmpApiObjectsArr.map( ( apiCallObject:ApiCallObject ) => {
              spanStatus( apiCallObject );
            });
            setApiObjects(tmpApiObjectsArr);

          }}
        />
      </span>

      <span style={{marginLeft:'20px'}}>
        <b>Sleep: </b>
        <input
          type='number'
          value={delayMS}
          style={{width:'100px', border: '1px solid gray'}}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          onChange={(e)=>setDelayMS(parseInt(e.target.value))}/>ms
      </span>

      <span style={{marginLeft:'20px'}}>
        <b>Sleep mode: </b>
        <Segmented
          options={[SLEEP_MODE_NORMAL, SLEEP_MODE_RANDOM]}
          defaultValue={sleepMode}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          style={{backgroundColor:'darkgray'}}
          onChange={(e)=>setSleepMode(e)}
        />
      </span>

      <span style={{marginLeft:'20px'}}>
        <PlayCircleOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY?'green':'black'}`}}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          onClick={ () => {
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY )
              return;

            setExperimentExecutionMode(EXPERIMENT_EXECUTION_MODE_PLAY);

            requestsLeftToRun = apiObjects.length;

            apiObjects.map( ( apiCallObject:ApiCallObject ) => {
              spanStatus( apiCallObject );
            });

            switch ( runMode )
            {
              case RUN_MODE_QUEUE:          run();  break;
              case RUN_MODE_THREADS:        run();  break;
              case RUN_MODE_THREADS_QUEUE:  run();  break;
              case RUN_MODE_RANDOM:         run();  break;
            }
          }}
        />
        <PauseCircleOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE?'green':'black'}`}}
          onClick={ ()=>{
            if ( experimentExecutionMode!==EXPERIMENT_EXECUTION_MODE_PLAY )
              return;

            setExperimentExecutionMode(EXPERIMENT_EXECUTION_MODE_PAUSE);

          }}
        />
        <BorderOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP?'green':'black'}`}}
          onClick={ ()=>{
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP )
              return;

            setExperimentExecutionMode(EXPERIMENT_EXECUTION_MODE_STOP);
            requestsLeftToRun = 0;
            abortControllerArr.map( cancel => {
              // cancel.signal.removeEventListener( 'abort', abortHandler );
              cancel.abort()
            } );
            setAbortControllerArr( [] );

            apiObjects.map( (apiCallObject:ApiCallObject) => {
              spanStatus( apiCallObject );
            });

          }}
        />
      </span>

      &nbsp;&nbsp;&nbsp;&nbsp;Experiment: {experimentExecutionMode}
      <br/>
      <br/>

      <div style={{textAlign: 'left'}}>
        <Tag color={typeIdToColor(qaObject.typeId)}>{typeIdToName(qaObject.typeId)}</Tag> - {qaObject.name}
        {
          hierarchy.filter( c => c.childrenObjectTypeId === COLLECTION ).map( m => m.childrenId ).map( childrenId => {
            const collection = objects.find(o => o.id === childrenId);
            let HTML = [
              <div key={`collectionBrowserExperiment${collection.id}`} style={{paddingLeft:'10px'}}>
                <Tag color={typeIdToColor(collection.typeId)}>{typeIdToName(collection.typeId)}</Tag>- {collection.name}
              </div>
            ];
            const suiteIds = hierarchy.filter( c => c.parentId === collection.id && c.childrenObjectTypeId === SUITE ).map( m => m.childrenId );
            suiteIds.map( suiteId => {
              const suite =  objects.find( o => o.id === suiteId );
              HTML.push(
                <div key={`suiteBrowserExperiment${collection.id}${suite.id}`} style={{paddingLeft:'20px'}}>
                  <Tag color={typeIdToColor(suite.typeId)}>{typeIdToName(suite.typeId)}</Tag>- {suite.name}
                </div>
              )

              const caseIds = hierarchy.filter( c => c.parentId === suite.id && c.childrenObjectTypeId === CASE ).map( m => m.childrenId );
              caseIds.map( caseId => {
                const cAse = objects.find( o => o.id === caseId );
                HTML.push(
                  <div key={`caseBrowserExperiment${collection.id}${suite.id}${cAse.id}`} style={{paddingLeft:'40px'}}>
                    <Tag color={typeIdToColor(cAse.typeId)}>{typeIdToName(cAse.typeId)}</Tag>- {cAse.name}
                  </div>
                );

                const testIds = hierarchy.filter( c => c.parentId === cAse.id && c.childrenObjectTypeId === TEST ).map( m => m.childrenId );

                testIds.map( testId => {
                  const test = objects.find( o => o.id === testId );

                    HTML.push(
                      <div key={`testBrowserExperiment${collection.id}${suite.id}${cAse.id}${test.id}`} style={{paddingLeft:'60px'}}>
                        <Tag color={typeIdToColor(test.typeId)}>{typeIdToName(test.typeId)}</Tag>- {test.name}
                      </div>
                    );

                    const TH = [<th>Thread</th>];
                    for ( let l = 0; l < cAse.loops; l++ )
                    {
                      TH.push(<th>Loop: {l+1}</th>)
                    }

                    const TR = [];
                    Array(...Array(cAse.threads)).map((_, thread) =>
                    {
                      const trKey = `${collection.id}${suite.id}${cAse.id}${test.id}${thread}`;
                      const DIV = [];
                      for ( let loop = 0; loop < cAse.loops; loop++ )
                      {
                        const apiCallObject:ApiCallObject = {collectionId:collection.id,suiteId:suite.id,caseId:cAse.id,testId:test.id,thread:thread,loop:loop,num:0, wait:false};
                        const key = createKey( apiCallObject );
                        DIV.push(
                          <span id={key} key={key} style={{width:`${100/cAse.loops}%`, border:'1px solid green', display:'inline-block', textAlign:'left', paddingLeft:'5px'}}>
                            Loop {loop+1} is waiting
                          </span>
                        )
                      } // end for loops
                      TR.push( <tr key={`tr${trKey}`}><td>{thread+1}</td><td style={{width:'100%'}}>{DIV}</td></tr>)
                    }) // end for threads
                  HTML.push(
                    <table key={`tableExperiment${collection.id}${suite.id}${cAse.id}${test.id}`} style={{width:'100%', marginTop: '10px', marginBottom: '10px'}} border={1}>
                      <tbody>
                        <tr><th style={{width:'1px'}}>Thread</th><th>Loops</th></tr>
                        {TR}
                      </tbody>
                    </table>
                  );
                });

              });
            });
            return <div key={`divExperiment`}>{HTML}</div>
          })
        }
      </div>
  </>

}

export default ExperimentBrowser
