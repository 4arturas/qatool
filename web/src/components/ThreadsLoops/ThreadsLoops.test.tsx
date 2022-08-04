import { render } from '@redwoodjs/testing/web'

import ThreadsLoops from './ThreadsLoops'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ThreadsLoops', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ThreadsLoops />)
    }).not.toThrow()
  })
})
