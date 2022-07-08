import type { FindExperimentQuery, FindExperimentQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import React, {useEffect, useState} from "react";
import {Button, DatePicker, Tag} from "antd";
import {BODY, CASE, COLLECTION, SERVER, SUITE, TEST, typeIdToColor, typeIdToName, typeIdToTag} from "src/global";
import Merge from "src/components/Merge/Merge";
import {ExperimentOutlined} from "@ant-design/icons";
import {useLazyQuery} from "@apollo/client";
import {toast, Toaster} from "@redwoodjs/web/toast";
import ExperimentResults from "src/components/ExperimentResults/ExperimentResults";
import ExperimentThreadsLoops from "src/components/ExperimentThreadsLoops/ExperimentThreadsLoops";
import ExperimentRequestLengthBoxPlot
  from "src/components/ExperimentRequestLengthBoxPlot/ExperimentRequestLengthBoxPlot";
import moment from "moment";
import {RangePickerProps} from "antd/es/date-picker";

export const QUERY = gql`
  query FindExperimentQuery($id: Int!) {
    findExperiment: findExperiment(id: $id) {
      experimentId
      relations {
        parentId
        childrenId
      }
      objects {
        id
        typeId
        name
        description
        batchId
        threads
        loops
        json
        jsonata
        address
        method
        header
        createdAt
        updatedAt
      }
    }
  }
`

const RUN_EXPERIMENT = gql`
  query RunExperiment($experimentId: Int!) {
    runExperiment(experimentId: $experimentId) {
      experimentId
      error
    }
  }
`

const FETCH_EXPERIMENT_RESULTS = gql`
  query FetchExperimentResults($experimentId: Int!) {
    experimentResultsByExperimentId(experimentId: $experimentId) {
      id
      type
      experimentId
      collectionId
      suiteId
      caseId
      thread
      loop
      request
      response
      requestDate
      responseDate
      status
      statusText
      txnId
      jsonata
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindExperimentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)


const Test = ( { experimentId, relations, objects } ) => {

  const [executedExperiments, setExecutedExperiments] = useState( [] );
  const [experimentExecuted, setExperimentExecuted] = useState( true );
  const [experiment, setExperiment] = useState( objects.find( o => o.id === experimentId ) );
  const [server, setServer] = useState( null );
  const [collection, setCollection] = useState( null );

  useEffect( () => {
    fetchExperiments( { variables: { experimentId } } );
    const collectionAndServer = relations.filter(exp => exp.parentId === experimentId);
    collectionAndServer.map( r => {
      const obj = objects.find( o => o.id === r.childrenId);
      switch ( obj.typeId )
      {
        case SERVER:
          setServer( obj );
          break;
        case COLLECTION:
          setCollection( obj );
          break;
      }
    })



  }, [] );

  const [runExperiment, { called, loading, data, error }] = useLazyQuery(RUN_EXPERIMENT, {
    onCompleted: () => {
      const { experimentId, error } = data.runExperiment;
      if ( error )
      {
        toast.error( error, { duration: 6000 } );
      }
      else
      {
        fetchExperiments( { variables: { experimentId } } );
        toast.success( 'Experiment was executed successfully' );
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    variables: { experimentId },
  });

  const [fetchExperiments, { called: calledFetchExperiments, loading: loadingFetchExperiments, data: dataCalledFetchExperiments }] = useLazyQuery(FETCH_EXPERIMENT_RESULTS, {
    onCompleted: () => {
      const experimentResultsByExperimentId = dataCalledFetchExperiments.experimentResultsByExperimentId;
      setExperimentExecuted(experimentResultsByExperimentId.length > 0 );
      setExecutedExperiments( experimentResultsByExperimentId );
    },
    onError: (error) => {
      toast.error(error.message)
    },
    variables: { experimentId },
  });

  const ExperimentRun = () =>
  {
    runExperiment();
  }
  let uniqueId = 0;

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // Can not select days before today and today
    // return current && current < moment().endOf('day');
    const d = new Date();
    d.setDate(d.getDate()-1);
    return current < moment( d );
  };
  const disabledDateTime = () => (
    {

    // disabledHours: () => range(0, 24).splice(4, 20),
    disabledHours: () => range(0, new Date().getHours()),
    disabledMinutes: () => range(0, new Date().getMinutes()),
    // disabledSeconds: () => [55, 56],
    disabledSeconds: () => range(1, 60),
  });

  return (
    <>

    <div key={`mainBlock${uniqueId++}`} style={{marginLeft: '20px'}}>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 3000 }} />
      { (experiment) &&
        <div key={`experiment${experimentId}${uniqueId++}`}>
          {typeIdToTag(experiment.typeId)}- {experiment.name}&nbsp;&nbsp;&nbsp;
          { !experimentExecuted ?
            <Button icon={<ExperimentOutlined/>} disabled={loading} onClick={ExperimentRun}>
              Run Experiment
            </Button>
            :
            <span>
            <ExperimentThreadsLoops
              experiments={executedExperiments}
              generateChartElement={
                (experiment) =>
                {
                  const {thread, loop, requestDate, responseDate, collectionId, suiteId, caseId } = experiment;
                  return [`User(${collectionId}${suiteId}${caseId}): ${String(thread + 1)}`, String(`Request: ${loop + 1}`), new Date(requestDate), new Date(responseDate)]
                }
              }
            />
            &nbsp;
            <ExperimentRequestLengthBoxPlot experiments={executedExperiments}/>
            </span>
          }

          &nbsp;&nbsp;&nbsp;
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            placeholder={'Set scheduler'}
            onOk={()=>alert('Not implemented yet')}
          />


        </div>   }

      { server &&
        <div key={`server${server.id}${uniqueId++}`} style={{marginLeft: '20px'}}>
          {typeIdToTag(server.typeId)}- {server.name}
        </div>   }

      { collection &&
        <div key={`collection${collection.id}${uniqueId++}`} style={{marginLeft: '20px'}}>
          {typeIdToTag(collection.typeId)}- {collection.name}
        </div>   }

      { collection && relations.filter( rF => rF.parentId === collection.id ).map( col => {
        const suite = objects.find( suite => suite.id === col.childrenId && suite.typeId === SUITE );
        return (

          <div key={`suiteBlock${experimentId}${collection.id}${suite.id}${uniqueId++}`} style={{marginLeft: '20px'}}>

            <div key={`suiteHeader${experimentId}${collection.id}${suite.id}${uniqueId++}`}>
              <Tag key={`suiteHeaderTag${experimentId}${collection.id}${suite.id}${uniqueId++}`} color={typeIdToColor(suite.typeId)}>
                {typeIdToName(suite.typeId)} - {suite.name}
              </Tag>
            </div>

            {relations.filter( cas => cas.parentId === suite.id ).map( rCase => {

              const cAse = objects.find( c => c.id === rCase.childrenId && c.typeId === CASE );

              return (
                <div key={`caseBlock${collection.id}${suite.id}${cAse.id}${uniqueId++}`} style={{marginLeft: '20px'}}>

                <div key={`caseHeader${collection.id}${suite.id}${cAse.id}${uniqueId++}`}>
                  {typeIdToTag(cAse.typeId)}- {cAse.name} <Merge qaObjectParent={cAse} /> {cAse.threads} user(s) will do {cAse.loops} request(s), in total {cAse.threads*cAse.loops}
                </div>

                  {relations.filter( f => f.parentId === cAse.id ).map( r => {
                  const obj = objects.find( bt => bt.id === r.childrenId );
                  switch ( obj.typeId )
                  {
                    case BODY: return (
                      <div key={`bodyBlock${collection.id}${suite.id}${cAse.id}${obj.id}${uniqueId++}`} style={{marginLeft: '20px'}}>
                        {typeIdToTag(obj.typeId)}- {obj.name}
                      </div>
                    )
                    case TEST: return (
                      <div key={`testBlock${collection.id}${suite.id}${cAse.id}${obj.id}${uniqueId++}`} style={{marginLeft: '20px'}}>
                        <div key={`testHeader${collection.id}${suite.id}${cAse.id}${obj.id}${uniqueId++}`}>
                          {typeIdToTag(obj.typeId)}- {obj.name}
                        </div>
                      </div>
                    )
                    default: return <div key={`unknown${collection.id}${suite.id}${cAse.id}${obj.id}${uniqueId++}`}>UNKNOWN ERROR</div>
                  }
                })}

                {
                  executedExperiments.length > 0 &&
                  <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <div style={{float:'left', paddingRight: '60px'}}>
                    <ExperimentThreadsLoops
                      experiments={executedExperiments.filter( e =>
                        e.experimentId === experimentId &&
                        e.collectionId === collection.id &&
                        e.suiteId === suite.id &&
                        e.caseId === cAse.id )}
                        generateChartElement={
                          (experiment) =>
                          {
                            const {thread, loop, requestDate, responseDate} = experiment;
                            return [`User: ${String(thread + 1)}`, String(`Request: ${loop + 1}`), new Date(requestDate), new Date(responseDate)]
                          }
                        }
                    />
                      &nbsp;
                      <ExperimentRequestLengthBoxPlot
                        experiments={executedExperiments.filter( e =>
                          e.experimentId === experimentId &&
                          e.collectionId === collection.id &&
                          e.suiteId === suite.id &&
                          e.caseId === cAse.id )}/>
                    </div>
                    <ExperimentResults
                      experiments={executedExperiments.filter( e =>
                        e.experimentId === experimentId &&
                        e.collectionId === collection.id &&
                        e.suiteId === suite.id &&
                        e.caseId === cAse.id )}/>

                  </div>
                }

                </div>
              ) /*return case*/
            }) }
          </div>
        ) /*return suite*/
      })}
    </div>
    </>
  );
}

export const Success = ({ findExperiment }: CellSuccessProps<FindExperimentQuery, FindExperimentQueryVariables>) => {
  return <Test experimentId={findExperiment.experimentId} relations={findExperiment.relations} objects={findExperiment.objects} />
}
