import { render } from '@redwoodjs/testing/web'

import TreeNew from './TreeNew'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TreeNew', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TreeNew />)
    }).not.toThrow()
  })
})
