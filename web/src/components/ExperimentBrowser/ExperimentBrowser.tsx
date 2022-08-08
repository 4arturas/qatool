import {
  calculateMedian,
  CASE,
  COLLECTION,
  EXPERIMENT,
  getRandomIntInclusive, minMaxAvg, MSG_INCOMING, MSG_OUTGOING,
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

const QUERY_RUN_BROWSER_EXPERIMENT = gql`
          query RunBrowserExperiment($experimentId: Int!, $collectionId: Int!, $suiteId: Int!, $caseId: Int!, $testId: Int!, $thread: Int!, $loop: Int!, $num: Int!) {
            runBrowserExperiment: runBrowserExperiment(experimentId: $experimentId, collectionId: $collectionId, suiteId: $suiteId, caseId: $caseId, testId: $testId, thread: $thread, loop: $loop, num: $num) {
              testId thread loop
              type paymentId request response requestDate responseDate jsonata txnId
            }
          }`;

const QUERY_RUN_BROWSER_EXPERIMENT_DEMO = gql`
          query RunBrowserExperimentDemo($experimentId: Int!, $collectionId: Int!, $suiteId: Int!, $caseId: Int!, $testId: Int!, $thread: Int!, $loop: Int!, $num: Int!) {
            runBrowserExperiment: runBrowserExperimentDemo(experimentId: $experimentId, collectionId: $collectionId, suiteId: $suiteId, caseId: $caseId, testId: $testId, thread: $thread, loop: $loop, num: $num) {
              testId thread loop
              type paymentId request response requestDate responseDate jsonata txnId
            }
          }`;

const stylingObject = {
  loop: {
    border:'0px solid green', display:'inline-block', textAlign:'left', padding:'5px'
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

interface ServerResponse
{
  type: number, paymentId: string, request:string, response:string, requestDate:string, responseDate:string, jsonata:string, txnId:string
}

interface ApiCallObject
{
  experimentId:number, collectionId: number, suiteId: number, caseId: number, testId: number, thread: number, loop: number, num: number, numRGB: string, wait: boolean,
  response: ServerResponse,
  time:number
}

const ExperimentBrowser = ( { qaObject, objects, hierarchy } ) => {

  const client = useApolloClient();
  const [apiObjects, setApiObjects] = useState([]);

  if ( qaObject.typeId !== EXPERIMENT ) return <></>

  const EXPERIMENT_EXECUTION_MODE_PLAY = 'Play';
  const EXPERIMENT_EXECUTION_MODE_PAUSE = 'Pause';
  const EXPERIMENT_EXECUTION_MODE_STOP = 'Stop';
  const EXPERIMENT_EXECUTION_MODE_DONE = 'Done';

  const [experimentExecutionMode, setExperimentExecutionMode] = useState(EXPERIMENT_EXECUTION_MODE_STOP);
  let experimentExecutionModeRef = EXPERIMENT_EXECUTION_MODE_STOP;
  const setExperimentExecutionModeRef = ( m ) =>
  {
    experimentExecutionModeRef = m;
  }

  const QUEUE_MODE_QUEUE = 'Queue';
  const QUEUE_MODE_THREADS = 'Threads';
  const QUEUE_MODE_THREADS_QUEUE = 'Threads Queue';
  const QUEUE_MODE_RANDOM = 'Random';
  const [queueMode, setQueueMode] = useState(QUEUE_MODE_THREADS);
  let queueModeRef = QUEUE_MODE_THREADS;
  const setQueueModeRef = ( m ) => queueModeRef = m;

  function delayFunction(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  const [delayMS, setDelayMS] = useState( 1000 );

  const SLEEP_MODE_NORMAL     = 'Normal';
  const SLEEP_MODE_RANDOM     = 'Random';
  const SLEEP_MODE_NO_SLEEP   = 'No Sleep';
  const [sleepMode, setSleepMode] = useState(SLEEP_MODE_NORMAL);
  let sleepModeRef = SLEEP_MODE_NORMAL;
  const setSleepModeRef = ( m ) => sleepModeRef = m;

  const RUN_MODE_NORMAL = 'Normal';
  const RUN_MODE_DEMO_SERVER = 'Demo Server';
  const RUN_MODE_DEMO_BROWSER = 'Demo Browser';
  const [runMode, setRunMode] = useState( RUN_MODE_NORMAL );
  let runModeRef = RUN_MODE_NORMAL;
  const setRunModeRef = ( m ) => runModeRef = m;

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
            experimentId: qaObject.id,
            collectionId: collectionId,
            suiteId: suiteId,
            caseId: caseId,
            testId: test.id,
            thread: thread,
            loop: loop,
            num: num,
            numRGB: numRGB(num++),
            wait: true,
            response: null,
            time: null
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
                experimentId: qaObject.id,
                collectionId: collectionId,
                suiteId: suiteId,
                caseId: cAse.id,
                testId: test.id,
                thread: thread,
                loop: loop,
                numRGB: numRGB(num),
                num: num++,
                wait: false,
                response: null,
                time: null
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

    let apiCallObject: ApiCallObject;
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
              apiCallObject = {
                experimentId: qaObject.id,
                collectionId: collectionId,
                suiteId: suiteId,
                caseId: cAse.id,
                testId: test.id,
                thread: thread,
                loop: loop,
                numRGB: numRGB(num),
                num: num++,
                wait: false,
                response: null,
                time: null
              };
              tmpApiObjectsArr.push(apiCallObject);
            });
          } // end if
        });
      } // end for thread
      if ( apiCallObject )
        apiCallObject.wait = true;
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
      apiCallObject.numRGB = numRGB(num);
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
  const toString = ( apiCallObject:ApiCallObject ): string =>
  {
    return `<span style="color:${apiCallObject.numRGB}"><b># </b>${apiCallObject.num}</span>`;
  }

  useEffect(() => {
    const tmpApiObjectsArr = set_RUN_MODE_THREADS();
    setApiObjects( tmpApiObjectsArr );

    tmpApiObjectsArr.map( ( apiCallObject:ApiCallObject ) => {
      apiObjects.push(apiCallObject);
    });
    tmpApiObjectsArr.map( ( apiCallObject:ApiCallObject ) => {
      apiCallObject.numRGB = numRGB(apiCallObject.num);
      spanStatus( apiCallObject );
    });
  }, []);

  const maxColor = 255;
  const norm = ( x ) => (x)*(maxColor/apiObjects.length);
  const numRGB = ( num:number ) => {
    const n = norm( num+0.0000001 );
    const r = maxColor-n;
    const g = 0;
    const b = 0;
    const rgb = `rgb(${r},${g},${b})`;
    return rgb;
  }
  const spanStatus = ( apiCallObject:ApiCallObject ) =>
  {
    const span = getSpan( apiCallObject );
    span.innerHTML = `${toString(apiCallObject)}`;
    span.style.backgroundColor = 'white';
    // span.innerHTML += apiCallObject.wait ? ' wait' : '';
    // span.style.backgroundColor = `white`;
    // span.style.color = numRGB( apiCallObject.num );
  }

  async function spanSleeping( apiCallObject:ApiCallObject )
  {
    const delayTime = (sleepMode===SLEEP_MODE_NORMAL) ? delayMS : getRandomIntInclusive( 0, delayMS );

    const span = getSpan(apiCallObject);
    // span.style.backgroundColor = 'yellow';
    span.style.color = 'black';

    const intervalDelay = 100;
    let showDelay = delayTime;
    const interval = setInterval( () => {
      if ( showDelay < 0 )
      {
        clearInterval( interval );
        return;
      }

      span.innerHTML = `<i class="fa-solid fa-moon" style="color:blue"></i>`;
      span.innerHTML += ` <span style="color:${apiCallObject.numRGB}"># ${apiCallObject.num}</span> - ${showDelay}ms thread=${apiCallObject.thread} loop=${apiCallObject.loop}`;
      showDelay -= intervalDelay;

    }, intervalDelay );

    await delayFunction(delayTime);
    clearInterval( interval );
  }

  const spanWorking = ( apiCallObject:ApiCallObject ) =>
  {

    const span = getSpan(apiCallObject);
    // span.appendChild( test() );
    span.innerHTML = '<span style="font-size: 18px; margin-bottom: -5px" class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span>';
    span.innerHTML += ` <span style="color:${apiCallObject.numRGB}"># ${apiCallObject.num}</span> - `;
    span.innerHTML += ` thread=${apiCallObject.thread} loop=${apiCallObject.loop}`;
    span.style.backgroundColor = 'white';
    span.style.color = 'black';
    // ReactDOM.render(<div><Spin size={'small'} /> WORKING with testId={text} thread={thread} loop={loop}</div>, span);
  }

  const MinMaxAvgMedian = ( arr ) =>
  {
    const tmpArr = arr.map(a=>a.time);
    const { min, max, avg } = minMaxAvg( tmpArr );
    const median = calculateMedian( tmpArr );
    return { min, max, avg, median };
  }

  const displayStatistics = ( length:number, min:number, max:number, avg:number, median:number ) =>
  {
    return `<b><u>STATISTICS</u></b>&nbsp;&nbsp;&nbsp;<b>Total:</b>${length} <b>Min:</b>${min} <b>Max:</b> ${max} <b>Avg:</b> ${avg.toFixed(2)} <b>Median:</b> ${median}`;
  }
  const statistics = {};
  const spanDone = ( apiCallObject:ApiCallObject, text ) =>
  {
    apiCallObject.time = new Date(apiCallObject.response.responseDate).getTime()-new Date(apiCallObject.response.requestDate).getTime();
    const span = getSpan(apiCallObject);
    span.innerHTML = `<i class="fa-solid fa-check" style="color:green"></i>`;
    span.innerHTML += ` <span style="color:${apiCallObject.numRGB}"># ${apiCallObject.num}</span> - `;
    span.innerHTML += ` thread=${apiCallObject.thread} loop=${apiCallObject.loop}`;
    // span.style.backgroundColor = 'lightgreen';
    span.style.color = 'black';

    statistics[apiCallObject.testId].push(apiCallObject);

    const arr = statistics[apiCallObject.testId];
    const { min, max, avg, median } = MinMaxAvgMedian( arr );
    const statisticsDiv = document.getElementById(`statistics${apiCallObject.testId}`);
    statisticsDiv.innerHTML =  displayStatistics( arr.length, min, max, avg, median );

    const globalArr = []
    const keys = Object.keys( statistics );
    keys.forEach( key => {
      const arr = statistics[key];
      globalArr.push( ...arr );
    });
    const { min:gMin, max:gMax, avg:gAvg, median:gMedian } = MinMaxAvgMedian( globalArr );
    const statisticsExperimentDiv = document.getElementById(`statisticsExperiment${qaObject.typeId}`);
    statisticsExperimentDiv.innerHTML = displayStatistics( globalArr.length, gMin, gMax, gAvg, gMedian );
    globalArr.map( (a:ApiCallObject) => {
      const sp = getSpan(a);


      sp.style.backgroundColor = `rgb(${r},${g},${b})`;
    });

    const HI = 255;
    const tmpNorm = ( x ) => Math.abs(((x-gMin)/(gMin-gMax))*HI);
    const n = tmpNorm( apiCallObject.time );
    const r = HI-n;
    const g = 0;
    const b = 0;
    span.innerHTML += `<span style="color:rgb(${r},${g},${b})"> time=${apiCallObject.time}</span>`
  }

  const spanError = ( apiCallObject:ApiCallObject, text:string ) =>
  {
    const span = getSpan(apiCallObject);
    span.innerHTML = `ERROR=${text} thread=${apiCallObject.thread} loop=${apiCallObject.loop}`;
    span.style.backgroundColor = 'red';
    span.style.color = 'black';
  }

  let requestsLeftToRun = 0;
  const [abortControllerArr, setAbortControllerArr] = useState( [] );
  const run = async () =>
  {
    Object.keys( statistics ).map( testId => statistics[testId] = [] );
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
          await apiCall( key, apiCallObject );
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

  const responseServerOk = (apiCallObject:ApiCallObject, runBrowserExperiment) =>
  {
    spanDone(apiCallObject, `${runBrowserExperiment.requestTime}ms srvThread=${runBrowserExperiment.thread} srvLoop=${runBrowserExperiment.loop}`);
    if ( requestsLeftToRun <= 0 )
    {
      setExperimentExecutionMode( EXPERIMENT_EXECUTION_MODE_DONE );
      setExperimentExecutionModeRef( EXPERIMENT_EXECUTION_MODE_DONE );
    }
  }

  const apiCall = async ( key, apiCallObject:ApiCallObject ) =>
  {
    requestsLeftToRun--;
    if ( requestsLeftToRun < 0 )
      return;

    if ( sleepMode !== SLEEP_MODE_NO_SLEEP )
      await spanSleeping(apiCallObject);

    spanWorking(apiCallObject);

    if ( runMode === RUN_MODE_DEMO_BROWSER )
    {
      apiCallObject.response = {type: MSG_OUTGOING, paymentId: '0', request:'request', response:'response', requestDate:new Date().toISOString(), responseDate:new Date().toISOString(), jsonata:'jsonata', txnId:null};
      responseServerOk( apiCallObject, {requestTime: 0, thread: apiCallObject.thread, loop: apiCallObject.loop })
      return;
    }

    const query = (runMode===RUN_MODE_NORMAL) ? QUERY_RUN_BROWSER_EXPERIMENT : QUERY_RUN_BROWSER_EXPERIMENT_DEMO;
    client.query({
      query: query,
      variables: {
        experimentId:apiCallObject.experimentId, collectionId:apiCallObject.collectionId, suiteId:apiCallObject.suiteId, caseId:apiCallObject.caseId, testId:apiCallObject.testId, thread: apiCallObject.thread, loop: apiCallObject.loop, num: apiCallObject.num
      }
    })
    .then( data => {
      const runBrowserExperiment = data.data.runBrowserExperiment;
      const response:ServerResponse = { type: runBrowserExperiment.type, paymentId:runBrowserExperiment.paymentId, request: runBrowserExperiment.request, response: runBrowserExperiment.response, requestDate: runBrowserExperiment.requestDate, responseDate:runBrowserExperiment.responseDate, jsonata:runBrowserExperiment.jsonata, txnId:runBrowserExperiment.txnId};
      apiCallObject.response = response;
      responseServerOk( apiCallObject, runBrowserExperiment );

    })
    .catch( e => {
      spanError(apiCallObject,e.message);
      if ( requestsLeftToRun <= 0 )
      {
        setExperimentExecutionMode( EXPERIMENT_EXECUTION_MODE_DONE );
        setExperimentExecutionModeRef( EXPERIMENT_EXECUTION_MODE_DONE );
      }
    } );

  }

  const mHTML = [];

  return <>
      <span style={{marginLeft:'20px'}}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
              integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
              crossOrigin="anonymous" referrerPolicy="no-referrer"/>
        <b>Queue mode: </b>
        <Segmented
          options={[QUEUE_MODE_QUEUE, QUEUE_MODE_THREADS, QUEUE_MODE_THREADS_QUEUE, QUEUE_MODE_RANDOM]}
          defaultValue={queueMode}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          style={{backgroundColor:'darkgray'}}
          onChange={ (e) => {
            setQueueMode(e.toString());
            setQueueModeRef(e.toString());
            let tmpApiObjectsArr:Array<ApiCallObject>;
            switch ( e )
            {
              case QUEUE_MODE_QUEUE:
                tmpApiObjectsArr = set_RUN_MODE_QUEUE();
                break;

              case QUEUE_MODE_THREADS:
                tmpApiObjectsArr = set_RUN_MODE_THREADS();
                break;

              case QUEUE_MODE_THREADS_QUEUE:
                tmpApiObjectsArr = set_RUN_MODE_THREADS_QUEUE();
                break;

              case QUEUE_MODE_RANDOM:
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
          options={[SLEEP_MODE_NORMAL, SLEEP_MODE_RANDOM, SLEEP_MODE_NO_SLEEP]}
          defaultValue={sleepMode}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          style={{backgroundColor:'darkgray'}}
          onChange={(e)=>{
            setSleepMode(e.toString());
            setSleepModeRef(e.toString());
          }}
        />
      </span>

    <span style={{marginLeft:'20px'}}>
        <b>Run mode: </b>
        <Segmented
          options={[RUN_MODE_NORMAL, RUN_MODE_DEMO_SERVER, RUN_MODE_DEMO_BROWSER]}
          defaultValue={runMode}
          disabled={experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY||experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE}
          style={{backgroundColor:'darkgray'}}
          onChange={(e)=>{
            setRunMode(e.toString());
            setRunModeRef(e.toString());
          }}
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
            setExperimentExecutionModeRef(EXPERIMENT_EXECUTION_MODE_PLAY);

            requestsLeftToRun = apiObjects.length;

            apiObjects.map( ( apiCallObject:ApiCallObject ) => {
              spanStatus( apiCallObject );
            });

            switch ( queueMode )
            {
              case QUEUE_MODE_QUEUE:          run();  break;
              case QUEUE_MODE_THREADS:        run();  break;
              case QUEUE_MODE_THREADS_QUEUE:  run();  break;
              case QUEUE_MODE_RANDOM:         run();  break;
            }
          }}
        />
        <PauseCircleOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE?'green':'black'}`}}
          onClick={ ()=>{
            if ( experimentExecutionMode!==EXPERIMENT_EXECUTION_MODE_PLAY )
              return;

            setExperimentExecutionMode(EXPERIMENT_EXECUTION_MODE_PAUSE);
            setExperimentExecutionModeRef(EXPERIMENT_EXECUTION_MODE_PAUSE);

          }}
        />
        <BorderOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP?'green':'black'}`}}
          onClick={ ()=>{
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP )
              return;

            setExperimentExecutionMode(EXPERIMENT_EXECUTION_MODE_STOP);
            setExperimentExecutionModeRef(EXPERIMENT_EXECUTION_MODE_STOP);
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

      <div>
        <Tag color={typeIdToColor(qaObject.typeId)}>{typeIdToName(qaObject.typeId)}</Tag> - {qaObject.name}
        <span id={`statisticsExperiment${qaObject.typeId}`} key={`statisticsExperiment${qaObject.typeId}`} style={{marginLeft:'20px', marginTop:'10px'}}>Statistics:</span>
        {
          objects.filter( o => o.typeId === CASE ).map( cAse => {
              const suiteId = hierarchy.find(h => h.childrenId === cAse.id).parentId;
              const collectionId = hierarchy.find(h => h.childrenId === suiteId).parentId;
              const testsIds = hierarchy.filter( h => h.parentId === cAse.id && h.childrenObjectTypeId === TEST ).map( m => m.childrenId );
              const suite = objects.find( o => o.id === suiteId );
              const collection = objects.find( o => o.id === collectionId );
              testsIds.map( testId => {
                statistics[testId] = [];
                const test = objects.find( o => o.id === testId );
                mHTML.push(
                  <div key={`col${collection.id}${suiteId}${cAse.id}${testId}`} style={{paddingLeft:'10px', marginTop:'40px'}}>
                    <Tag color={typeIdToColor(collection.typeId)}>{typeIdToName(collection.typeId)}</Tag>{collection.name}
                    &nbsp;&nbsp;&nbsp;
                    <Tag color={typeIdToColor(suite.typeId)}>{typeIdToName(suite.typeId)}</Tag>{suite.name}
                    &nbsp;&nbsp;&nbsp;
                    <Tag color={typeIdToColor(cAse.typeId)}>{typeIdToName(cAse.typeId)}</Tag>{cAse.name}
                    &nbsp;&nbsp;&nbsp;
                    <Tag color={typeIdToColor(test.typeId)}>{typeIdToName(test.typeId)}</Tag>{test.name}
                    <span id={`statistics${testId}`} key={`statistics${testId}`} style={{marginRight:'20px', float:'right'}}><b><u>STATISTICS</u></b></span>
                  </div>
                );
                mHTML.push();

                const TH = [
                  <tr key={`trthT${collection.id}${suite.id}${cAse.id}${test.id}`}>
                    <th key={`thT${collection.id}${suite.id}${cAse.id}${test.id}`} style={{textAlign:'left', width:'80px'}}>Thread</th>
                    {
                      Array.from(Array(cAse.loops).keys()).map( loop => {
                        return <th key={`thL${collection.id}${suite.id}${cAse.id}${test.id}${loop}`} style={{textAlign:'left'}}>Loop {loop}</th>
                      })
                    }

                  </tr>
                ];
                const TR = [];
                for ( let thread = 0; thread < cAse.threads; thread++ )
                {
                  const DIV = [];
                  for ( let loop = 0; loop < cAse.loops; loop++ )
                  {
                    const apiCallObject:ApiCallObject = {
                      experimentId: qaObject.id,
                      collectionId: collectionId,
                      suiteId: suiteId,
                      caseId: cAse.id,
                      testId: test.id,
                      thread: thread,
                      loop: loop,
                      num: 0,
                      numRGB: 'rgb(0,0,0)',
                      wait: false,
                      response: null,
                      time:null
                    };
                    const key = createKey( apiCallObject );
                    DIV.push(
                      <td id={key} key={key} style={{border: '1px solid gray', width:`${100/cAse.loops}%`}}>
                        Loop {loop+1} is waiting
                      </td>
                    )
                  } // end for loop
                  const trKey = `${collection.id}${suite.id}${cAse.id}${test.id}${thread}`;
                  TR.push( <tr key={`tr${trKey}`}><td>&nbsp;&nbsp;&nbsp;{thread+1}</td>{DIV}</tr>)
                } // end for thread
                mHTML.push(
                  <table key={`tbl${collectionId}${suiteId}${cAse.id}${testId}`} style={{border:'1px solid black', width:'100%'}} cellPadding={2} cellSpacing={2}>
                    <thead>{TH}</thead>
                    <tbody>
                      {TR}
                    </tbody>
                  </table>
                )
              });
          })
        }

        <div key={`divExperiment`}>{mHTML}</div>
      </div>
  </>

}

export default ExperimentBrowser;
