import type { CellFailureProps } from '@redwoodjs/web'

import {SelectField} from "@redwoodjs/forms";
import {useLazyQuery} from "@apollo/client";
import {useEffect, useState} from "react";

export const QUERY = gql`
  query FindQaObjectByObjectType($typeId: Int!) {
    qaObjects: getQaObjectsByType(typeId: $typeId) {
      id
      name
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

export const Empty = () => <div>QaObject not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)



export const Success = ({ qaObjects, multiple, parentId }) => {

  const [defaultValue, setDefaultValue] = useState(null);

  const [loadChildren, { called, loading: l, data }] = useLazyQuery(FIND_RELATIONSHIPS_WITH_THE_SAME_PARENT_ID, {
    variables: { parentId },
  });

  useEffect(() => {

    if ( parentId )
    {
      const getAsyncChildrenByParentId = async () => {
        const queryResult = await loadChildren();
        const data = queryResult.data.qaObjectRelationshipsWithTheSameParentId;
        const children = data.map((c)=>c.childrenId);
        setDefaultValue( children );
      };
      getAsyncChildrenByParentId();
    }
    else
      setDefaultValue([]);

  }, []);

  return <>
    {!defaultValue ? <span>Loading</span> :
      <SelectField defaultValue={defaultValue} multiple={multiple} name="children">
        {qaObjects.map((q) => {
          return <option key={q.id} value={q.id}>{q.name}</option>
        })}
      </SelectField>
    }
  </>
}
