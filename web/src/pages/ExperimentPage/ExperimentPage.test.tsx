import { render } from '@redwoodjs/testing/web'

import ExperimentPage from './ExperimentPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ExperimentPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentPage />)
    }).not.toThrow()
  })
})
