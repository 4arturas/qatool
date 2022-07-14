import { render } from '@redwoodjs/testing/web'

import UserEdit from './UserEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserEdit />)
    }).not.toThrow()
  })
})
