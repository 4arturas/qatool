import { render } from '@redwoodjs/testing/web'

import QaObjectRelationships from './QaObjectRelationships'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectRelationships', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectRelationships />)
    }).not.toThrow()
  })
})
