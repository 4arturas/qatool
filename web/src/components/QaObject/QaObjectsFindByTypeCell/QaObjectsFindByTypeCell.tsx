import type { CellFailureProps } from '@redwoodjs/web'

import {SelectField} from "@redwoodjs/forms";

export const QUERY = gql`
  query FindQaObjectByObjectType($typeId: Int!) {
    qaObjects: getQaObjectsByType(typeId: $typeId) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>QaObject not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ qaObjects, multiple, defaultValue }) => {
  return <SelectField defaultValue={defaultValue} multiple={multiple} name="children">{qaObjects.map((q) => {
    return <option key={q.id} value={q.id}>{q.name}</option>
  })}</SelectField>
}
