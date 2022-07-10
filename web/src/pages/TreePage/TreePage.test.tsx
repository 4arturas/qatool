import { render } from '@redwoodjs/testing/web'

import TreePage from './TreePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TreePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TreePage />)
    }).not.toThrow()
  })
})
