import { render } from '@redwoodjs/testing/web'

import ExperimentBrowser from './ExperimentBrowser'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExperimentBrowser', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExperimentBrowser />)
    }).not.toThrow()
  })
})
