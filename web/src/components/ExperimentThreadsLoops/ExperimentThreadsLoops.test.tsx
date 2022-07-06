import { render } from '@redwoodjs/testing/web'

import ExperimentThreadsLoops from './ExperimentThreadsLoops'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExperimentThreadsLoops', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentThreadsLoops />)
    }).not.toThrow()
  })
})
