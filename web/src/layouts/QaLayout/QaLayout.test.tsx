import { render } from '@redwoodjs/testing/web'

import QaLayout from './QaLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaLayout />)
    }).not.toThrow()
  })
})
