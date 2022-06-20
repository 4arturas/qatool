import { render } from '@redwoodjs/testing/web'

import QaTreeLayout from './QaTreeLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaTreeLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaTreeLayout />)
    }).not.toThrow()
  })
})
