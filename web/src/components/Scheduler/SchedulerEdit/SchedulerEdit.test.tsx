import { render } from '@redwoodjs/testing/web'

import SchedulerEdit from './SchedulerEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SchedulerEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SchedulerEdit />)
    }).not.toThrow()
  })
})
