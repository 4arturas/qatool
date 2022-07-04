import { render } from '@redwoodjs/testing/web'

import QaObjects from './QaObjects'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjects', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjects />)
    }).not.toThrow()
  })
})
