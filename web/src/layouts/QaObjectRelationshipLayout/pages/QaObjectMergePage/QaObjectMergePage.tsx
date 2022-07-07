import { MetaTags } from '@redwoodjs/web'
import { useApolloClient } from '@apollo/client';
import React, {useEffect, useState} from "react";
import {
  BODY,
  CASE,
  typeIdToName,
  REMOVE,
  REPLACE,
  TEST,
  typeIdToColor,
  SERVER,
  RESULT,
  mergeObjectsFromTestObject
} from "src/global";
import ReactDiffViewer from 'react-diff-viewer'
import {Select} from "antd";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
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
    return <span
      className='qaObjectTypeClass'
      style={{backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>
      <span style={{textDecoration: 'underline'}}>{typeIdToName(qaObject.typeId)}</span> - <span id={`objEditName${qaObject.id}`}>"{qaObject.name}"</span>
              <ObjectEdit qaObject={qaObject} beforeSave={() => {
              }} afterSave={(obj) => {
                document.getElementById(`objEditName${obj.id}`).innerHTML = obj.name;
                switch ( obj.typeId )
                {
                  case BODY:
                    setBody(obj);
                    break;
                  case TEST:
                    setTest(obj);
                    break;
                  case REPLACE:
                    setReplace( obj );
                    break;
                  case REMOVE:
                    setRemove( obj );
                    break;
                  case RESULT:
                    setResult( obj );
                    break;
                }

              }}/>
          </span>
  }

  return (
    <>
      <MetaTags title="QaObjectMerge" description="QaObjectMerge page" />

      {((!parent||!body||!test||!replace||!remove||!result)) && <div>In order to show diff, {wrap(CASE)} must have {wrap(BODY)} and {wrap(TEST)}. {wrap(TEST)} must have {wrap(REPLACE)}, {wrap(REMOVE)} and {wrap(RESULT)}</div>}

      { (parent&&body&&test&&replace&&remove&&result) &&
        <table style={{width:'100%'}}>
          <tbody>

          <tr>
            <td style={{padding: '5px'}}>
              Data in {wrap2(body)} was removed using {wrap2(remove)} and replaced with data from {wrap2(replace)}, response will be checked width {wrap2(result)} on {wrap2(test)}.
            </td>
          </tr>

          <tr>
            <td style={{padding:'5px'}}>
              <ReactDiffViewer
                oldValue={JSON.stringify(JSON.parse(body.json), undefined, 2 )}
                newValue={JSON.stringify(mergeObjectsFromTestObject(JSON.parse(body.json), JSON.parse(replace.json),  JSON.parse(remove.json)), undefined, 2 )}
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
