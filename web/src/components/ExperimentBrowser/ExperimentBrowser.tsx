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
import React, {useRef, useState} from "react";
import {Button, Modal, Segmented, Tag, Tooltip} from "antd";
import {useApolloClient} from "@apollo/client";
import {BorderOutlined, PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";

const ExperimentBrowser = ( { qaObject, objects, hierarchy } ) => {

  const client = useApolloClient();

  if ( qaObject.typeId !== EXPERIMENT ) return <></>
  if ( qaObject.executed ) return <></>

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [intervalObject, setIntervalObject] = useState(null);
  let intervalObject = null;
  function setIntervalObject(i) { intervalObject = i; }

  const EXPERIMENT_EXECUTION_MODE_PLAY = 'Play';
  const EXPERIMENT_EXECUTION_MODE_PAUSE = 'Pause';
  const EXPERIMENT_EXECUTION_MODE_STOP = 'Stop';
  const EXPERIMENT_EXECUTION_MODE_DONE = 'Done';

  let experimentExecutionModeAsync = EXPERIMENT_EXECUTION_MODE_STOP;
  const [experimentExecutionMode, setExperimentExecutionMode] = useState( experimentExecutionModeAsync );
  function setExperimentExecutionModeAsync( mode )
  {
    experimentExecutionModeAsync = mode;
    setExperimentExecutionMode( mode );
  }


  const RUN_MODE_QUEUE = 'Queue';
  const RUN_MODE_THREADS = 'Threads';
  const RUN_MODE_THREADS_QUEUE = 'Threads Queue';
  const [runMode, setRunMode] = useState(RUN_MODE_THREADS);

  function delayFunction(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  const [delayMS, setDelayMS] = useState( 5000 );

  const SLEEP_MODE_NORMAL = 'Normal';
  const SLEEP_MODE_RANDOM = 'Random';
  const [sleepMode, setSleepMode] = useState(SLEEP_MODE_NORMAL);

  const mode1 = {};
  const mode2 = {};

  async function spanSleeping(id)
  {
    const delayTime = (sleepMode===SLEEP_MODE_NORMAL) ? delayMS : getRandomIntInclusive( 0, delayMS );

    const intervalDelay = 1000;
    let showDelay = delayTime;
    setIntervalObject(
      setInterval( () => {
        const span = document.getElementById(id);
        if ( experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_STOP || experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_PAUSE )
        {
          console.log( experimentExecutionModeAsync );
          if ( experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_PAUSE )
          {
            span.innerHTML = 'PAUSED';
            span.style.backgroundColor = 'gray';
            span.style.color = 'black';
          }

          clearInterval( intervalObject );
          return;
        }


        span.innerHTML = `SLEEPING - ${showDelay}ms`;
        showDelay -= intervalDelay;
        span.style.backgroundColor = 'yellow';
        span.style.color = 'black';


      }, intervalDelay )
    );


    await delayFunction(delayTime);
    clearInterval( intervalObject );
  }

  const spanWorking = ( id ) =>
  {
    const span = document.getElementById(id);
    span.innerHTML = 'WORKING';
    span.style.backgroundColor = 'red';
    span.style.color = 'black';
  }

  const spanDone = ( id ) =>
  {
    const span = document.getElementById(id);
    span.innerHTML = 'DONE';
    span.style.backgroundColor = 'green';
    span.style.color = 'black';
  }

  let runModeQueueKey = 0;
  const runModeQueue = async () =>
  {
    const keys = Object.keys( mode1 );
    for ( ; runModeQueueKey < keys.length; runModeQueueKey++ )
    {
      if ( experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_PAUSE || experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_STOP )
        return;
      const key = keys[runModeQueueKey];
      const { id, testId } = mode1[key];
      await apiCall( id, testId );
    } // end for k
    setExperimentExecutionModeAsync( EXPERIMENT_EXECUTION_MODE_DONE );
  }

  let runModeThreadsKey = 0;
  let runModeThreadsThread = 0;
  let runModeThreadsLoop = 0;
  const runModeThreads = async () =>
  {
    const keys = Object.keys( mode2 );

    for ( ; runModeThreadsKey < keys.length; runModeThreadsKey++ )
    {
      const key = keys[runModeThreadsKey];
      const {testId, threads, loops} = mode2[key];
      for ( ; runModeThreadsThread < threads; runModeThreadsThread++ )
      {
        const p = new Promise( async (resolve, reject) => {
          for ( ; runModeThreadsLoop < loops; runModeThreadsLoop++ )
          {
            if ( experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_PAUSE || experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_STOP )
              return;
            const newKey = `${key}${runModeThreadsThread}${runModeThreadsLoop}`;
            await apiCall( newKey, testId );
          }
        })
      }
    }
    setExperimentExecutionModeAsync( EXPERIMENT_EXECUTION_MODE_DONE );
  }

  let runModeThreadsQueueKey = 0;
  let runModeThreadsQueueThread = 0;
  let runModeThreadsQueueLoop = 0;
  const runModeThreadsQueue = () =>
  {
    const keys = Object.keys( mode2 );

    for ( ;runModeThreadsQueueKey < keys.length; runModeThreadsQueueKey++ )
    {
      const key = keys[runModeThreadsQueueKey];
      const {threads, loops, testId} = mode2[key];
      const p = new Promise( async (resolve, reject) => {
      for ( ; runModeThreadsQueueThread < threads; runModeThreadsQueueThread++ )
      {
          for ( ; runModeThreadsQueueLoop < loops; runModeThreadsQueueLoop++ )
          {
            if ( experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_PAUSE || experimentExecutionModeAsync === EXPERIMENT_EXECUTION_MODE_STOP )
              return;
            const newKey = `${key}${runModeThreadsQueueThread}${runModeThreadsQueueLoop}`;
            await apiCall( newKey, testId );
          }
      }
      });
    }
    setExperimentExecutionModeAsync( EXPERIMENT_EXECUTION_MODE_DONE );
  }

  const apiCall = async ( key, testId ) =>
  {
    await spanSleeping(key);
    spanWorking(key);

    const RUN_BROWSER_EXPERIMENT = gql`
          query RunBrowserExperiment($bodyId: Int!, $testId: Int!) {
            runBrowserExperiment(bodyId: $bodyId, testId: $testId) {
              bodyId testId
            }
          }
        `;
    const data = await client.query({
      query: RUN_BROWSER_EXPERIMENT,
      variables: {bodyId: 1, testId:1}
    });
    console.log( data.data.runBrowserExperiment );

    spanDone(key);
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
    <Tooltip title={'Request Length Box Plot'}>
      <Button
        onClick={ ()=> {
          setIsModalVisible(true)
        }}
      >
       Run Experiment in Browser
      </Button>
    </Tooltip>
    <Modal
      title={'Run Experiment in Browser'}
      visible={isModalVisible}
      onOk={()=>setIsModalVisible(false)}
      onCancel={()=>setIsModalVisible(false)}
      width={'100%'}
    >

      <span style={{marginLeft:'20px'}}>
        Run mode: <Segmented options={[RUN_MODE_QUEUE, RUN_MODE_THREADS, RUN_MODE_THREADS_QUEUE]} defaultValue={runMode} disabled={false} onChange={(e)=>setRunMode(e)}/>
      </span>

      <span style={{marginLeft:'20px'}}>
        Sleep: <input type='number' value={delayMS} style={{width:'100px', border: '1px solid gray'}} onChange={(e)=>setDelayMS(parseInt(e.target.value))}/>ms
      </span>

      <span style={{marginLeft:'20px'}}>
        Sleep mode: <Segmented options={[SLEEP_MODE_NORMAL, SLEEP_MODE_RANDOM]} defaultValue={sleepMode} disabled={false} onChange={(e)=>setSleepMode(e)}/>
      </span>

      <span style={{marginLeft:'20px'}}>
        <PlayCircleOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY?'green':'black'}`}}
          onClick={ () => {
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PLAY )
              return;

            setExperimentExecutionModeAsync(EXPERIMENT_EXECUTION_MODE_PLAY);

            setExperimentExecutionModeAsync((previousState) => (
              EXPERIMENT_EXECUTION_MODE_PLAY
            ));

            switch ( runMode )
            {
              case RUN_MODE_QUEUE:          runModeQueue();         break;
              case RUN_MODE_THREADS:        runModeThreads();       break;
              case RUN_MODE_THREADS_QUEUE:  runModeThreadsQueue();  break;
            }
          }}
        />
        <PauseCircleOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE?'green':'black'}`}}
          onClick={()=>{
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_PAUSE )
              return;

            setExperimentExecutionModeAsync(EXPERIMENT_EXECUTION_MODE_PAUSE);

          }}
        />
        <BorderOutlined
          style={{...stylingObject.stop, color: `${experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP?'green':'black'}`}}
          onClick={()=>{
            if ( experimentExecutionMode===EXPERIMENT_EXECUTION_MODE_STOP )
              return;

            setExperimentExecutionModeAsync(EXPERIMENT_EXECUTION_MODE_STOP);

            const keys = Object.keys( mode1 );
            keys.map( k => {
              const span = document.getElementById(k);
              span.innerHTML = 'Waiting';
              span.style.backgroundColor = 'white';
            });

            runModeQueueKey = 0;

            runModeThreadsKey = 0;
            runModeThreadsThread = 0;
            runModeThreadsLoop = 0;

            runModeThreadsQueueKey = 0;
            runModeThreadsQueueThread = 0;
            runModeThreadsQueueLoop = 0;
          }}
        />
      </span>

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

                  const idMode2 = `span${collection.id}${suite.id}${cAse.id}${test.id}`;
                  mode2[idMode2] = {caseId: caseId, testId:testId, threads:cAse.threads, loops:cAse.loops};

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
                        const modeKey = `span${collection.id}${suite.id}${cAse.id}${test.id}${thread}${loop}`;
                        mode1[modeKey] = { id: modeKey, testId: test.id };
                        DIV.push(
                          <span id={modeKey} key={modeKey} style={{width:`${100/cAse.loops}%`, border:'1px solid green', display:'inline-block', textAlign:'left', paddingLeft:'5px'}}>
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
    </Modal>
  </>

}

export default ExperimentBrowser
