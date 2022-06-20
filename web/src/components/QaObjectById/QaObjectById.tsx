import {Link, routes} from "@redwoodjs/router";

const QaObjectById = ({qaObject}) => {
  return (
    <div>
      <h2 style={{display:'inline', marginRight: '10px'}}>{qaObject.name}</h2>
      <a href={`/qa-objects/${qaObject.id}/edit`} style={{marginRight:'10px'}}>New</a>
      <a href={`/qa-objects/${qaObject.id}/edit`}>Edit</a>
    </div>
  )
}

export default QaObjectById
