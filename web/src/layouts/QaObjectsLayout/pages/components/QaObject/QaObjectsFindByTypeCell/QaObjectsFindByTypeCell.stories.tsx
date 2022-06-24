import { Form } from '@redwoodjs/forms'
import { Loading, Empty, Failure, Success } from './QaObjectsFindByTypeCell'
import { standard } from './QaObjectsFindByTypeCell.mock'

export const loading = () => {
  return Loading ? <Loading /> : null
}

export const empty = () => {
  return Empty ? <Empty /> : null
}

export const failure = () => {
  return Failure ? <Failure error={new Error('Oh no')} /> : null
}

export const success = () => {
  return Success ? <Form>
    <div style={{display:"flex", flexDirection: "row"}}>
      <div>
        <Success name="childrenMultiple" parentId={null} multiple={true} {...standard()} />
      </div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div>
        <Success name="childrenSingle" parentId={null} multiple={false} {...standard()} />
      </div>
    </div>
  </Form> : null
}

export default { title: 'Cells/QaObjectsFindByTypeCell' }
