import { render } from '@redwoodjs/testing/web'

import QaObjectsTree from './QaObjectsTree'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectsTree', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectsTree />)
    }).not.toThrow()
  })
})
