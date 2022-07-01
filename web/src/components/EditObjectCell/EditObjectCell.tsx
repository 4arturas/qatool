import type { EditQaObjectById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjectForm from "src/components/QaObjectForm";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";
import {useState} from "react";
import {useLazyQuery} from "@apollo/client";
import {getChildrenFromInput} from "src/global";
import {Modal} from "antd";

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

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<EditQaObjectById>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
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
      Modal.close();
      navigate(routes.tmpQaObject({page:1, pageSize: 10}))
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


  return <QaObjectForm qaObject={qaObject} onSave={onSave} error={error} loading={loading} />
}
