import { render } from '@redwoodjs/testing/web'

import ExperimentResults from './ExperimentResults'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExperimentResults', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentResults />)
    }).not.toThrow()
  })
})
