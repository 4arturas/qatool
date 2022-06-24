import type { EditQaObjectById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {useMutation, useQuery} from '@redwoodjs/web'
import {useLazyQuery} from '@apollo/client'
import {toast, Toaster} from '@redwoodjs/web/toast'

import QaObjectForm from 'src/layouts/QaObjectsLayout/pages/components/QaObject/QaObjectForm'
import {useState} from "react";
import {navigate, routes} from "@redwoodjs/router";
import {getChildrenFromInput} from "src/global";

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
      address
      method
      header
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
      address
      method
      header
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

const DELETE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation DeleteQaObjectRelationshipMutation($id: Int!) {
    deleteQaObjectRelationship(id: $id) {
      id
    }
  }
`

const FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID = gql`
  query FindRelationshipsWithTheSameParentId($parentId: Int!) {
    qaObjectRelationshipsWithTheSameParentId(parentId: $parentId) {
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

export const Success = ({ qaObject }: CellSuccessProps<EditQaObjectById>) => {

  const [parentId, setParentId] = useState(0);
  const [children, setChildren] = useState([]);

  const [loadChildren, { called, loading: l, data }] = useLazyQuery(FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID, {
    variables: { parentId },
  });

  const [deleteQaObjectRelationship] = useMutation(DELETE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
    },
    onError: (error) => {
    },
  })

  const [updateQaObject, { loading, error }] = useMutation(UPDATE_QA_OBJECT_MUTATION, {

    onCompleted: async () => {
      const queryResult = await loadChildren();
      const data = queryResult.data.qaObjectRelationshipsWithTheSameParentId;
      data.map((p)=> {
        const id = p.id;
        deleteQaObjectRelationship({ variables: { id } });
      });

      children.map( (childrenId) => {
        const castInput = { parentId: parentId, childrenId: parseInt(childrenId) };
        createQaObjectRelationship({ variables: { input: castInput } });
      });

      toast.success('QaObject updated')
      navigate(routes.qaObjects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [createQaObjectRelationship, { loading: loadingQaObjectRelationship, error: errorQaObjectRelationship }] = useMutation(CREATE_QA_OBJECT_RELATIONSHIP_MUTATION, {
    onCompleted: () => {
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    const childrenFromInput: Array<number> = getChildrenFromInput(input);
    setChildren( childrenFromInput );

    setParentId(id);

    const castInput = Object.assign(input, { typeId: parseInt(input.typeId), batchId: parseInt(input.batchId), })
    updateQaObject({ variables: { id, input: castInput } })
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
