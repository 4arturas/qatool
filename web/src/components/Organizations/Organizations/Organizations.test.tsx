import { render } from '@redwoodjs/testing/web'

import Organizations from './Organizations'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Organizations', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Organizations />)
    }).not.toThrow()
  })
})
