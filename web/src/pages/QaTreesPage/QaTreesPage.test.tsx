import { render } from '@redwoodjs/testing/web'

import QaTreesPage from './QaTreesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaTreesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaTreesPage />)
    }).not.toThrow()
  })
})
