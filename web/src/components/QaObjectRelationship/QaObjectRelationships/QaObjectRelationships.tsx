import humanize from 'humanize-string'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes } from '@redwoodjs/router'

import { QUERY } from 'src/components/QaObjectRelationship/QaObjectRelationshipsCell'

const DELETE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation DeleteQaObjectRelationshipMutation($id: Int!) {
    deleteQaObjectRelationship(id: $id) {
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

const QaObjectRelationshipsList = ({ qaObjectRelationships }) => {
  const [deleteQaObjectRelationship] = useMutation(DELETE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
      toast.success('QaObjectRelationship deleted')
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
    if (confirm('Are you sure you want to delete qaObjectRelationship ' + id + '?')) {
      deleteQaObjectRelationship({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Parent id</th>
            <th>Children id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {qaObjectRelationships.map((qaObjectRelationship) => (
            <tr key={qaObjectRelationship.id}>
              <td>{truncate(qaObjectRelationship.id)}</td>
              <td>{truncate(qaObjectRelationship.parentId)}</td>
              <td>{truncate(qaObjectRelationship.childrenId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.qaObjectRelationship({ id: qaObjectRelationship.id })}
                    title={'Show qaObjectRelationship ' + qaObjectRelationship.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editQaObjectRelationship({ id: qaObjectRelationship.id })}
                    title={'Edit qaObjectRelationship ' + qaObjectRelationship.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete qaObjectRelationship ' + qaObjectRelationship.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(qaObjectRelationship.id)}
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

export default QaObjectRelationshipsList
