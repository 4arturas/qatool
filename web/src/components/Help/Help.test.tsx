import { render } from '@redwoodjs/testing/web'

import Help from './Help'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Help', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Help />)
    }).not.toThrow()
  })
})
