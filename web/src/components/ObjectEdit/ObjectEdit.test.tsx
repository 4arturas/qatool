import { render } from '@redwoodjs/testing/web'

import ObjectEdit from './ObjectEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectEdit />)
    }).not.toThrow()
  })
})
