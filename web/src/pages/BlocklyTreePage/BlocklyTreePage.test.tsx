import { render } from '@redwoodjs/testing/web'

import BlocklyTreePage from './BlocklyTreePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('BlocklyTreePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BlocklyTreePage />)
    }).not.toThrow()
  })
})
