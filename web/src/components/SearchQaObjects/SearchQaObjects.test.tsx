import { render } from '@redwoodjs/testing/web'

import SearchQaObjects from './SearchQaObjects'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SearchQaObjects', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SearchQaObjects />)
    }).not.toThrow()
  })
})
