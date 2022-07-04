import { render } from '@redwoodjs/testing/web'

import Merge from './Merge'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Merge', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Merge />)
    }).not.toThrow()
  })
})
