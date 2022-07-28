import { render } from '@redwoodjs/testing/web'

import ObjectView from './ObjectView'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ObjectView', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectView />)
    }).not.toThrow()
  })
})
