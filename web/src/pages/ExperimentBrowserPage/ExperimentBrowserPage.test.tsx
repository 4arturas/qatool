import { render } from '@redwoodjs/testing/web'

import ExperimentBrowserPage from './ExperimentBrowserPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ExperimentBrowserPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentBrowserPage />)
    }).not.toThrow()
  })
})
