import { render } from '@redwoodjs/testing/web'

import QaObjectRelationshipLayout from './QaObjectRelationshipLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectRelationshipLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectRelationshipLayout />)
    }).not.toThrow()
  })
})
