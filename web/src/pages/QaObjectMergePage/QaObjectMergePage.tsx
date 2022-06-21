import { MetaTags } from '@redwoodjs/web'
import { useApolloClient } from '@apollo/client';
import {useEffect, useState} from "react";
import {BODY, CASE, merge, objectTypeToName, REMOVE, REPLACE, TEST, typeIdToColor} from "src/global";
import ReactDiffViewer from 'react-diff-viewer'
import {Link, routes} from "@redwoodjs/router";

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

  useEffect(()=> {
    async function fetchAllObjects()
    {
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
              }
            });
            break;
        }
      });

    }
    fetchAllObjects();
  }, []);

  const wrap = (typeId) => {
    return <span className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(typeId)}`}}>{objectTypeToName(typeId)}</span>
  }

  const wrap2 = (qaObject) => {
    return <Link to={routes.editQaObject({id:qaObject.id})} className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>{qaObject.name}</Link>
  }

  return (
    <>
      <MetaTags title="QaObjectMerge" description="QaObjectMerge page" />

      {((!parent||!body||!test||!replace||!remove)) && <div>In order to show diff, {wrap(CASE)} must have {wrap(BODY)} and {wrap(TEST)}. {wrap(TEST)} must have {wrap(REPLACE)} and {wrap(REMOVE)}</div>}

      { (parent&&body&&test&&replace&&remove) &&
        <table style={{width:'100%'}}>
          <tbody>
          <tr>
            <td style={{paddingBottom: '30px'}}>Data in {wrap2(body)} was removed using {wrap2(remove)} and replaced with data from {wrap2(replace)}</td>
          </tr>
          <tr>
            <td>
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
