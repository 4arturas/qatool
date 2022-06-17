import type { EditQaObjectById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

import QaObjectForm from 'src/components/QaObject/QaObjectForm'
import {useState} from "react";

export const QUERY = gql`
  query EditQaObjectById($id: Int!) {
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
      createdAt
      updatedAt
    }
  }
`
const UPDATE_QA_OBJECT_MUTATION = gql`
  mutation UpdateQaObjectMutation($id: Int!, $input: UpdateQaObjectInput!) {
    updateQaObject(id: $id, input: $input) {
      id
      typeId
      name
      description
      batchId
      threads
      loops
      json
      jsonata
      createdAt
      updatedAt
    }
  }
`

const CREATE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation CreateQaObjectRelationshipMutation($input: CreateQaObjectRelationshipInput!) {
    createQaObjectRelationship(input: $input) {
      id
    }
  }
`

const DELETE_QA_OBJECT_RELATIONSHIP_BY_PARENT_ID_MUTATION = gql`
  mutation DeleteQaObjectRelationshipMutation($parentId: Int!) {
    deleteQaObjectRelationshipByParentId(parent: $parentId) {
      parentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObject }: CellSuccessProps<EditQaObjectById>) => {

  const [parentId, setParentId] = useState(0);
  const [children, setChildren] = useState([]);

  const [updateQaObject, { loading, error }] = useMutation(UPDATE_QA_OBJECT_MUTATION, {

    onCompleted: () => {

      deleteQaObjectRelationshipByParentId({ variables: { parentId } });

/*      children.map( (childrenId) => {
        const castInput = { parentId: parentId, childrenId: parseInt(childrenId) };
        createQaObjectRelationship({ variables: { input: castInput } });
      });*/


      toast.success('QaObject updated')
      // navigate(routes.qaObjects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    setChildren(input.children);
    delete input.children;

    setParentId(id);
    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    updateQaObject({ variables: { id, input: castInput } })
  }

  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
      // toast.success('QaObjectRelationship created')
      // navigate(routes.qaObjectRelationships())
      console.log( 'hello')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [deleteQaObjectRelationshipByParentId] = useMutation(DELETE_QA_OBJECT_RELATIONSHIP_BY_PARENT_ID_MUTATION, {
    onCompleted: () => {
      // toast.success('QaObjectRelationship deleted')
    },
    onError: (error) => {
      // toast.error(error.message)
    }
  })

  const onSaveQaObjectRelationship = (input) => {
    const castInput = Object.assign(input, { parentId: parseInt(input.parentId), childrenId: parseInt(input.childrenId), })
    createQaObjectRelationship({ variables: { input: castInput } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit QaObject {qaObject.id}</h2>
      </header>
      <div className="rw-segment-main">
        <QaObjectForm qaObject={qaObject} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
