import { render } from '@redwoodjs/testing/web'

import DeleteObject from './DeleteObject'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DeleteObject', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DeleteObject />)
    }).not.toThrow()
  })
})
