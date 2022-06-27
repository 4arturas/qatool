import { render } from '@redwoodjs/testing/web'

import TestRun from './TestRun'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TestRun', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TestRun />)
    }).not.toThrow()
  })
})
