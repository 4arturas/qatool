import { render } from '@redwoodjs/testing/web'

import EditObject from './EditObject'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EditObject', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditObject />)
    }).not.toThrow()
  })
})
