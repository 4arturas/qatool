import { render } from '@redwoodjs/testing/web'

import ExperimentResult from './ExperimentResult'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExperimentResult', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentResult />)
    }).not.toThrow()
  })
})
