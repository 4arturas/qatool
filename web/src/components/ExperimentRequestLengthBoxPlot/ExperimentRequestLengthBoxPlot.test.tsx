import { render } from '@redwoodjs/testing/web'

import ExperimentRequestLengthBoxPlot from './ExperimentRequestLengthBoxPlot'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExperimentRequestLengthBoxPlot', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentRequestLengthBoxPlot />)
    }).not.toThrow()
  })
})
