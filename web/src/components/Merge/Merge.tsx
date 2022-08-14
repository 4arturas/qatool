
import React, {useState} from "react";
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
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";
import {useAuth} from "@redwoodjs/auth";

const Merge = ( {merge} ) => {
  const { hasRole } = useAuth();
  const [parent, setParent] = useState(merge.caseParent);
  const [body, setBody] = useState(merge.body);
  const [test, setTest] = useState(merge.test);
  const [replace, setReplace] = useState(merge.replace);
  const [remove, setRemove] = useState(merge.remove);
  const [result, setResult] = useState(merge.result);

  const wrap = (typeId) => {
    return <span className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(typeId)}`}}>{typeIdToName(typeId)}</span>
  }

  const wrap2 = (qaObjectEdit) => {
    return <span
      className='qaObjectTypeClass'
      style={{backgroundColor: `${typeIdToColor(qaObjectEdit.typeId)}`, padding: '8px'}}>
      <span style={{textDecoration: 'underline'}}>{typeIdToName(qaObjectEdit.typeId)}</span> - <span id={`objEditName${qaObjectEdit.id}`}>"{qaObjectEdit.name}"</span>
      { (hasRole([ROLE_ADMIN]) && !qaObjectEdit.executed) && <span style={{backgroundColor:'gray', borderRadius:'10px', padding: '5px', paddingBottom: '6px', paddingLeft: '6px', marginLeft:'3px'}}>
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
  );
}

export default Merge
