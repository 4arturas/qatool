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
  return Success ? <Form><Success multiple={true} {...standard()} /></Form> : null
}

export default { title: 'Cells/QaObjectsFindByTypeCell' }
