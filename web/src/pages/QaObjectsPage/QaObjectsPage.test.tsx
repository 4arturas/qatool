import { render } from '@redwoodjs/testing/web'

import QaObjectsPage from './QaObjectsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectsPage />)
    }).not.toThrow()
  })
})
