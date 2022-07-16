import { render } from '@redwoodjs/testing/web'

import ObjectNewTest from './ObjectNewTest'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectNewTest', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectNewTest />)
    }).not.toThrow()
  })
})
