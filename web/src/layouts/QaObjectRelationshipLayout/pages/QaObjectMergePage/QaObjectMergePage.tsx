import { MetaTags } from '@redwoodjs/web'
import { useApolloClient } from '@apollo/client';
import React, {useEffect, useState} from "react";
import {BODY, CASE, merge, typeIdToName, REMOVE, REPLACE, TEST, typeIdToColor, SERVER, RESULT} from "src/global";
import ReactDiffViewer from 'react-diff-viewer'
import {Link, routes} from "@redwoodjs/router";
import {Button, Select} from "antd";
import jsonata from "jsonata";
const { Option } = Select;

type QaObjectMergePageProps = {
  parentId: number
}

const QaObjectMergePage = ({ parentId }: QaObjectMergePageProps) => {

  const client = useApolloClient();

  const [parent, setParent] = useState(null);
  const [body, setBody] = useState(null);
  const [test, setTest] = useState(null);
  const [replace, setReplace] = useState(null);
  const [remove, setRemove] = useState(null);
  const [result, setResult] = useState(null);
  const [servers, setServers] = useState([]);
  const [server, setServer] = useState(null);
  const [response, setResponse] = useState(null);

  const getChildren = async ( parentId:number) =>
  {
    const data = await client.query({
      query: gql`
        query FindQaObjectMergeQuery($parentId: Int!) {
          qaObjectRelationshipsWithTheSameParentId: qaObjectRelationshipsWithTheSameParentId(parentId: $parentId) {
            id
            parentId
            childrenId
          }
        }
    `,
      variables: {parentId:parentId}
    });
    return data.data.qaObjectRelationshipsWithTheSameParentId;
  }

  const getObjectById = async ( id:number) =>
  {
    const data = await client.query({
      query: gql`
        query FindQaObjectByIdQuery($id: Int!) {
          qaObject: qaObject(id: $id) {
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
    `,
      variables: {id:id}
    });
    return data.data.qaObject;
  }

  const getObjectByTypeId = async ( typeId:number) =>
  {
    const data = await client.query({
      query: gql`
        query FindQaObjectByTypeIdQuery($typeId: Int!) {
          getQaObjectsByType: getQaObjectsByType(typeId: $typeId) {
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
    `,
      variables: {typeId:typeId}
    });
    return data.data.getQaObjectsByType;
  }

  useEffect(()=> {
    async function fetchAllObjects()
    {

      const serversArray = await getObjectByTypeId(SERVER);
      setServers(serversArray);

      const parent = await getObjectById(parentId);
      setParent(parent);

      const children = await getChildren(parentId);
      await children.map( async (children) => {
        const tmp = await getObjectById( children.childrenId );
        switch ( tmp.typeId ) {
          case BODY:
            setBody( tmp );
            break;
          case TEST:
            setTest( tmp );
            const testChildren = await getChildren( tmp.id );
            testChildren.map( async (c) => {
              const testChildrenTmp = await getObjectById( c.childrenId );
              switch ( testChildrenTmp.typeId ) {
                case REPLACE:
                  setReplace( testChildrenTmp );
                  break;
                case REMOVE:
                  setRemove( testChildrenTmp );
                  break;
                case RESULT:
                  setResult( testChildrenTmp );
                  break;
              }
            });
            break;
        }
      });

    }
    fetchAllObjects();
  }, []);

  const wrap = (typeId) => {
    return <span className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(typeId)}`}}>{typeIdToName(typeId)}</span>
  }

  const wrap2 = (qaObject) => {
    return <Link to={routes.editQaObject({id:qaObject.id})}
                 className='qaObjectTypeClass'
                 style={{backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>
      <span style={{textDecoration: 'underline'}}>{typeIdToName(qaObject.typeId)}</span> - "{qaObject.name}"
    </Link>
  }

  return (
    <>
      <MetaTags title="QaObjectMerge" description="QaObjectMerge page" />

      {((!parent||!body||!test||!replace||!remove)) && <div>In order to show diff, {wrap(CASE)} must have {wrap(BODY)} and {wrap(TEST)}. {wrap(TEST)} must have {wrap(REPLACE)} and {wrap(REMOVE)}</div>}

      { (parent&&body&&test&&replace&&remove) &&
        <table style={{width:'100%'}}>
          <tbody>

          <tr>
            <td style={{padding: '5px'}}>
              Data in {wrap2(body)} was removed using {wrap2(remove)} and replaced with data from {wrap2(replace)} on {wrap2(test)}.
            </td>
          </tr>

          <tr>
            <td style={{padding:'5px'}}>
              Make a request
              <Select defaultValue="-1"
                      onChange={(e) => setServer( servers.find( (s) => s.id === e ) ) }
                      style={{marginLeft:'10px'}}
              >
                <Option key={-1} value="-1">Select server</Option>
                {servers.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
              <Button
                disabled={!server}
                style={{marginLeft:'10px'}}
                onClick={ async () => {
                  const tmpServer = server;
                  setServer(null);
                  setResponse(null)
                  try {
                    const res = await fetch(`/.redwood/functions/runTest`,
                      {
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({
                          server: server.id,
                          body: body.id,
                          test: test.id,
                          replace: replace.id,
                          remove: remove.id
                        })
                      });
                    const data = (await res.json()).data;
                    setResponse(JSON.stringify(data, undefined, 2));
                    setServer(tmpServer);
                  }
                  catch ( error )
                  {
                    setResponse(error);
                  }
                }}
              >
                Run
              </Button>
            </td>
          </tr>

          <tr>
            <td style={{padding:'5px'}}>
              <table>
                <tbody>
                <tr>
                  <td>
                    {response &&
                      <ReactDiffViewer
                        oldValue={response}
                        newValue={response}
                        splitView={false}
                      />}
                  </td>
                  <td>
                    <strong>JSONata:</strong> {response ? <span style={{color:jsonata(result.jsonata).evaluate(JSON.parse(response))?'green':'red'}}>{result.jsonata}</span> : <span>{result?.jsonata}</span> }
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{padding:'5px'}}>
              <ReactDiffViewer
                oldValue={JSON.stringify(JSON.parse(body.json), undefined, 2 )}
                newValue={JSON.stringify(merge(JSON.parse(body.json), JSON.parse(replace.json),  JSON.parse(remove.json)), undefined, 2 )}
                splitView={true}
              />
            </td>
          </tr>
          </tbody>

        </table>
      }

    </>
  )
}

export default QaObjectMergePage
