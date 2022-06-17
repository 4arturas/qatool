import type { EditQaObjectRelationshipById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

import QaObjectRelationshipForm from 'src/components/QaObjectRelationship/QaObjectRelationshipForm'

export const QUERY = gql`
  query EditQaObjectRelationshipById($id: Int!) {
    qaObjectRelationship: qaObjectRelationship(id: $id) {
      id
      parentId
      childrenId
    }
  }
`
const UPDATE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation UpdateQaObjectRelationshipMutation($id: Int!, $input: UpdateQaObjectRelationshipInput!) {
    updateQaObjectRelationship(id: $id, input: $input) {
      id
      parentId
      childrenId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObjectRelationship }: CellSuccessProps<EditQaObjectRelationshipById>) => {
  const [updateQaObjectRelationship, { loading, error }] = useMutation(UPDATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
      toast.success('QaObjectRelationship updated')
      navigate(routes.qaObjectRelationships())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    const castInput = Object.assign(input, { parentId: parseInt(input.parentId), childrenId: parseInt(input.childrenId), })
    updateQaObjectRelationship({ variables: { id, input: castInput } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit QaObjectRelationship {qaObjectRelationship.id}</h2>
      </header>
      <div className="rw-segment-main">
        <QaObjectRelationshipForm qaObjectRelationship={qaObjectRelationship} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
