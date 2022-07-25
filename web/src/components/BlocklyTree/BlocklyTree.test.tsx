import { render } from '@redwoodjs/testing/web'

import BlocklyTree from './BlocklyTree'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BlocklyTree', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BlocklyTree />)
    }).not.toThrow()
  })
})
