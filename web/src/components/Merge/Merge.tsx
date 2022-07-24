import {Modal, Tooltip} from "antd";
import React, {useState} from "react";
import {faCodeFork} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useApolloClient} from "@apollo/client";
import {
  BODY,
  CASE,
  mergeObjectsFromTestObject,
  REMOVE,
  REPLACE,
  RESULT, ROLE_ADMIN,
  TEST,
  typeIdToColor,
  typeIdToName
} from "src/global";
import ReactDiffViewer from "react-diff-viewer";
import {Spin} from "antd/es";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";
import {useAuth} from "@redwoodjs/auth";

const Merge = ( {qaObject} ) => {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState( true );

  if ( qaObject.typeId !== TEST ) return <></>;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const client = useApolloClient();

  const [parent, setParent] = useState(null);
  const [body, setBody] = useState(null);
  const [test, setTest] = useState(null);
  const [replace, setReplace] = useState(null);
  const [remove, setRemove] = useState(null);
  const [result, setResult] = useState(null);

  const findMergeObjects = ( testId:number) =>
  {
    client.query({
      query: gql`
        query FindMergeObjects($testId: Int!) {
          merge: findMergeObjects(testId: $testId) {
            caseParent { id, typeId, name, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
            body { id, typeId, name, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
            test { id, typeId, name, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
            replace { id, typeId, name, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
            remove { id, typeId, name, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
            result { id, typeId, name, json, parent { id, parentId, childrenId, childrenObjectTypeId}, organization { id, name } }
          }
        }
      `,
      variables: {testId:qaObject.id}
    })
    .then( res => {
      const merge = res.data.merge;
      setParent( merge.caseParent );
      setBody( merge.body );
      setTest( merge.test );
      setReplace( merge.replace );
      setRemove( merge.remove );
      setResult( merge.result );
      setLoading( false );
      })
    .catch( e => {
      console.log( e );
    });
  }

  const wrap = (typeId) => {
    return <span className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(typeId)}`}}>{typeIdToName(typeId)}</span>
  }

  const wrap2 = (qaObjectEdit) => {
    return <span
      className='qaObjectTypeClass'
      style={{backgroundColor: `${typeIdToColor(qaObjectEdit.typeId)}`, padding: '8px'}}>
      <span style={{textDecoration: 'underline'}}>{typeIdToName(qaObjectEdit.typeId)}</span> - <span id={`objEditName${qaObjectEdit.id}`}>"{qaObjectEdit.name}"</span>
      { hasRole([ROLE_ADMIN]) && <span style={{backgroundColor:'gray', borderRadius:'10px', padding: '5px', paddingBottom: '6px', paddingLeft: '6px', marginLeft:'3px'}}>
          <ObjectNewTest
            typeId={qaObjectEdit.typeId}
            qaObject={qaObjectEdit}
            cloneObject={false}
            parentId={null}
            children={qaObjectEdit.parent.map( p => { return { id: p.childrenId, typeId: p.childrenObjectTypeId } } )}
            beforeSave={() => {}}
            afterSave={(obj) => {
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
          </span>}
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
            findMergeObjects( 10 );
          } }/>
      </Tooltip>

      <Modal
        title={ 'Merge' }
        visible={isModalVisible}
        onOk={()=>setIsModalVisible(false)}
        onCancel={()=>setIsModalVisible(false)}
        footer={null}
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
