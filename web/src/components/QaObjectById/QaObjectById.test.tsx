import { render } from '@redwoodjs/testing/web'

import QaObjectById from './QaObjectById'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectById', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectById />)
    }).not.toThrow()
  })
})
