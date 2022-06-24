import humanize from 'humanize-string'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes } from '@redwoodjs/router'

import { QUERY } from 'src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectsCell'
import {CASE, typeIdToName, typeIdToColor, typeIdMargin, RESULT} from "src/global";
import jsonata from "jsonata";

const DELETE_QA_OBJECT_MUTATION = gql`
  mutation DeleteQaObjectMutation($id: Int!) {
    deleteQaObject(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const formatEnum = (values: string | string[] | null | undefined) => {
  if (values) {
    if (Array.isArray(values)) {
      const humanizedValues = values.map((value) => humanize(value))
      return humanizedValues.join(', ')
    } else {
      return humanize(values as string)
    }
  }
}

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2))
}

const timeTag = (datetime) => {
  return (
    datetime && (
      <time dateTime={datetime} title={datetime}>
        {new Date(datetime).toUTCString()}
      </time>
    )
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const QaObjectsList = ({ qaObjects }) => {
  const [deleteQaObject] = useMutation(DELETE_QA_OBJECT_MUTATION, {
    onCompleted: () => {
      toast.success('QaObject deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete qaObject ' + id + '?')) {
      deleteQaObject({ variables: { id } })
    }
  }

  const checkJSONata = (jsonStr:string,jsonataStr:string):boolean =>
  {
    const json = JSON.parse(jsonStr);
    const expression = jsonata(jsonataStr);
    const result = expression.evaluate(json);
    return result;
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Object Type</th>
            <th>Name</th>
            <th>Description</th>
            <th>Batch id</th>
            <th>Threads</th>
            <th>Loops</th>
            <th>Json</th>
            <th>JSONata</th>
            <th>Address</th>
            <th>Method</th>
            <th>Header</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {qaObjects.map((qaObject) => (
            <tr key={qaObject.id}>
              <td>{truncate(qaObject.id)}</td>
              <td>
                <span className='qaObjectTypeClass' style={{marginLeft: `${typeIdMargin(qaObject.typeId)}px`, backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>{truncate(typeIdToName(qaObject.typeId))}</span>
              </td>
              <td style={{whiteSpace:'nowrap'}}>
                <Link to={routes.qaObjectRelationship({id:qaObject.id})} className='qaObjectTypeClass' style={{backgroundColor: `${typeIdToColor(qaObject.typeId)}`}}>
                  {truncate(qaObject.name)}
                </Link>
                { qaObject.typeId===CASE && <Link to={routes.qaObjectMerge({parentId:qaObject.id})} style={{marginLeft:'10px'}}>Merge</Link>}
              </td>
              <td>{truncate(qaObject.description)}</td>
              <td>{truncate(qaObject.batchId)}</td>
              <td>{truncate(qaObject.threads)}</td>
              <td>{truncate(qaObject.loops)}</td>
              <td>{truncate((qaObject.json && qaObject.json.length > 10) ? ( qaObject.json.substring(0, 10) + '...') : qaObject.json)}</td>
              <td>
                { qaObject.typeId === RESULT &&
                  <span style={{color:( checkJSONata(qaObject.json, qaObject.jsonata)? 'green':'red' )}}>
                    {truncate((qaObject.jsonata && qaObject.jsonata.length > 10) ? ( qaObject.jsonata.substring(0, 10) + '...') : qaObject.jsonata)}
                  </span> }
              </td>
              <td>{truncate(qaObject.address)}</td>
              <td>{truncate(qaObject.method)}</td>
              <td>{truncate(qaObject.header)}</td>
              <td>{timeTag(qaObject.createdAt)}</td>
              <td>{timeTag(qaObject.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.qaObject({ id: qaObject.id })}
                    title={'Show qaObject ' + qaObject.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editQaObject({ id: qaObject.id })}
                    title={'Edit qaObject ' + qaObject.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete qaObject ' + qaObject.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(qaObject.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default QaObjectsList
