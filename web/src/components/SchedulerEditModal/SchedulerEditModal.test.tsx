import { render } from '@redwoodjs/testing/web'

import SchedulerEditModal from './SchedulerEditModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SchedulerEditModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SchedulerEditModal />)
    }).not.toThrow()
  })
})
