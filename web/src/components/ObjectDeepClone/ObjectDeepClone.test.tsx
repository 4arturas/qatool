import { render } from '@redwoodjs/testing/web'

import ObjectDeepClone from './ObjectDeepClone'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectDeepClone', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectDeepClone />)
    }).not.toThrow()
  })
})
