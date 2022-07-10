import { render } from '@redwoodjs/testing/web'

import Tree from './Tree'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Tree', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Tree />)
    }).not.toThrow()
  })
})
