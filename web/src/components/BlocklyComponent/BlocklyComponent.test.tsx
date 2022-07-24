import { render } from '@redwoodjs/testing/web'

import BlocklyComponent from './BlocklyComponent'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BlocklyComponent', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BlocklyComponent />)
    }).not.toThrow()
  })
})
