import humanize from 'humanize-string'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes, navigate } from '@redwoodjs/router'
import {typeIdToName} from "src/global";

const DELETE_QA_OBJECT_MUTATION = gql`
  mutation DeleteQaObjectMutation($id: Int!) {
    deleteQaObject(id: $id) {
      id
    }
  }
`

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

const jsonDisplay = (obj) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
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

const QaObject = ({ qaObject }) => {
  const [deleteQaObject] = useMutation(DELETE_QA_OBJECT_MUTATION, {
    onCompleted: () => {
      toast.success('QaObject deleted')
      navigate(routes.qaObjects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete qaObject ' + id + '?')) {
      deleteQaObject({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">QaObject {qaObject.id} Detail</h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{qaObject.id}</td>
            </tr><tr>
              <th>Type id</th>
              <td>{typeIdToName(qaObject.typeId)}</td>
            </tr><tr>
              <th>Name</th>
              <td>{qaObject.name}</td>
            </tr><tr>
              <th>Description</th>
              <td>{qaObject.description}</td>
            </tr><tr>
              <th>Batch id</th>
              <td>{qaObject.batchId}</td>
            </tr><tr>
              <th>Threads</th>
              <td>{qaObject.threads}</td>
            </tr><tr>
              <th>Loops</th>
              <td>{qaObject.loops}</td>
            </tr><tr>
              <th>Json</th>
              <td>{qaObject.json}</td>
            </tr><tr>
              <th>Jsonata</th>
              <td>{qaObject.jsonata}</td>
            </tr><tr>
            </tr><tr>
              <th>Address</th>
              <td>{qaObject.address}</td>
            </tr><tr>
            </tr><tr>
              <th>Method</th>
              <td>{qaObject.method}</td>
            </tr><tr>
            </tr><tr>
              <th>Header</th>
              <td>{qaObject.header}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(qaObject.createdAt)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(qaObject.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editQaObject({ id: qaObject.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(qaObject.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default QaObject
