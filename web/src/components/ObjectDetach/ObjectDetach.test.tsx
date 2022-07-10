import { render } from '@redwoodjs/testing/web'

import ObjectDetach from './ObjectDetach'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectDetach', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectDetach />)
    }).not.toThrow()
  })
})
