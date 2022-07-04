import { render } from '@redwoodjs/testing/web'

import ObjectClone from './ObjectClone'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectClone', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectClone />)
    }).not.toThrow()
  })
})
