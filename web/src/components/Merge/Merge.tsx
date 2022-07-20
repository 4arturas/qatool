import {Modal, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {faCodeFork} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useApolloClient} from "@apollo/client";
import {
  BODY,
  CASE,
  mergeObjectsFromTestObject,
  REMOVE,
  REPLACE,
  RESULT,
  SERVER,
  TEST,
  typeIdToColor,
  typeIdToName
} from "src/global";
import ReactDiffViewer from "react-diff-viewer";
import {Spin} from "antd/es";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";

const Merge = ( {qaObjectParent} ) => {

  const [loading, setLoading] = useState( true );

  if ( qaObjectParent.typeId !== CASE ) return <></>;

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const wrap = (typeId) => {
    return <span className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(typeId)}`}}>{typeIdToName(typeId)}</span>
  }

  const wrap2 = (qaObject) => {
    return <span
      className='qaObjectTypeClass'
      style={{backgroundColor: `${typeIdToColor(qaObject.typeId)}`, padding: '8px'}}>
      <span style={{textDecoration: 'underline'}}>{typeIdToName(qaObject.typeId)}</span> - <span id={`objEditName${qaObject.id}`}>"{qaObject.name}"</span>
      <span style={{backgroundColor:'gray', borderRadius:'10px', padding: '5px', paddingBottom: '6px', paddingLeft: '6px', marginLeft:'3px'}}>
      <ObjectNewTest typeId={qaObject.typeId} qaObject={qaObject} cloneObject={false} parentId={null} children={[]} beforeSave={() => {
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
          </span>
  }


  return (

    <>
      <Tooltip title="Show Merge">
        <FontAwesomeIcon
          icon={faCodeFork}
          style={{fontSize:'20px', cursor: 'pointer'}}
          onClick={ () => {
            setIsModalVisible(true);
            async function fetchAllObjects()
            {

              const serversArray = await getObjectByTypeId(SERVER);
              setServers(serversArray);

              const parent = await getObjectById(qaObjectParent.id);
              setParent(parent);

              const children = await getChildren(qaObjectParent.id);
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
              setLoading( false );
            }
            fetchAllObjects();
          } }/>
      </Tooltip>

      <Modal
        title={ 'Merge' }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        // footer={null}
        width={'90%'}
      >
        { loading && <Spin/> }

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

      </Modal>
    </>
  );
}

export default Merge
