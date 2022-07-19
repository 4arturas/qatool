import { render } from '@redwoodjs/testing/web'

import Users from './Users'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Users', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Users />)
    }).not.toThrow()
  })
})
