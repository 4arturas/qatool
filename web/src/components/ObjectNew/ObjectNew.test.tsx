import { render } from '@redwoodjs/testing/web'

import ObjectNew from './ObjectNew'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectNew', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectNew />)
    }).not.toThrow()
  })
})
