import { render } from '@redwoodjs/testing/web'

import QaObjectsTreePage from './QaObjectsTreePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectsTreePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectsTreePage />)
    }).not.toThrow()
  })
})
