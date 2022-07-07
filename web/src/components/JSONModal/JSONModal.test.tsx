import { render } from '@redwoodjs/testing/web'

import JsonModal from './JsonModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('JsonModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<JsonModal />)
    }).not.toThrow()
  })
})
