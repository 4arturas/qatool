import { render } from '@redwoodjs/testing/web'

import ExperimentResultsPage from './ExperimentResultsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ExperimentResultsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentResultsPage />)
    }).not.toThrow()
  })
})
