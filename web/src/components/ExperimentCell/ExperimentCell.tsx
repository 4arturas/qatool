import type { FindExperimentQuery, FindExperimentQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import React, {useEffect, useState} from "react";
import {Button, Tag} from "antd";
import {BODY, CASE, COLLECTION, SERVER, SUITE, TEST, typeIdToColor, typeIdToName, typeIdToTag} from "src/global";
import Merge from "src/components/Merge/Merge";
import {ExperimentOutlined} from "@ant-design/icons";

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindExperimentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)


const Test = ( { experimentId, relations, objects } ) => {

  const [experiment, setExperiment] = useState( objects.find( o => o.id === experimentId ) );
  const [server, setServer] = useState( null );
  const [collection, setCollection] = useState( null );

  useEffect( () => {
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

  return (
    <>
    <style>
    </style>
    <div style={{marginLeft: '20px'}}>

      { experiment &&
        <div>
          {typeIdToTag(experiment.typeId)}- {experiment.name}&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={null} icon={<ExperimentOutlined/>}>
            Run Experiment
          </Button>
        </div>   }

      { server &&  <div style={{marginLeft: '20px'}}>{typeIdToTag(server.typeId)}- {server.name}</div>   }

      { collection &&  <div style={{marginLeft: '20px'}}>{typeIdToTag(collection.typeId)}- {collection.name}</div>   }

      { collection && relations.filter( rF => rF.parentId === collection.id ).map( cM => {
        const suite = objects.find( s => s.id === cM.childrenId && s.typeId === SUITE );
        return (
          <div key={`suiteBlock${suite.id}`} style={{marginLeft: '20px'}}>
            <div key={`suiteHeader${suite.id}`}><Tag color={typeIdToColor(suite.typeId)}>{typeIdToName(suite.typeId)} - {suite.name}</Tag></div>
            {relations.filter( cF => cF.parentId === suite.id ).map( r => {
              const cAse = objects.find( c => c.id === r.childrenId && c.typeId === CASE );
              return (
                <div key={`caseBlock${cAse.id}`} style={{marginLeft: '20px'}}>
                <div key={`caseHeader${cAse.id}`}>{typeIdToTag(cAse.typeId)}- {cAse.name} <Merge qaObjectParent={cAse} /> {cAse.threads} user(s) will do {cAse.loops} request(s), in total {cAse.threads*cAse.loops}</div>

                  {relations.filter( f => f.parentId === cAse.id ).map( r => {
                  const obj = objects.find( bt => bt.id === r.childrenId );
                  switch ( obj.typeId )
                  {
                    case BODY: return (
                      <div key={`bodyBlock${obj.id}`} style={{marginLeft: '20px'}}>{typeIdToTag(obj.typeId)}- {obj.name}</div>
                    )
                    case TEST: return (
                      <div key={`testBlock${obj.id}`} style={{marginLeft: '20px'}}>{typeIdToTag(obj.typeId)}- {obj.name}</div>
                    )
                    default: return <div>UNKNOWN ERROR</div>
                  }
                })}

                  <table style={{border:'1px solid red', marginTop: '10px', width: '100%'}} border={1} cellPadding={10}>
                    <tbody>
                    {[...Array(cAse.threads*10)].map((y, thread) =>
                      <tr>
                        <td style={{width:'70px', whiteSpace: 'nowrap'}}><b>User {thread+1}</b></td>
                        <td>
                          <div style={{display:'flex', width: '100%'}}>
                          {[...Array(cAse.loops*10)].map((x, loop) =>
                            <div style={{border: '1px solid green', width: '10%'}}>
                              Request {loop+1} - paymentId-{collection.batchId}-{suite.batchId}-{cAse.batchId}-{thread}-{loop}
                            </div>
                          )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>

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
