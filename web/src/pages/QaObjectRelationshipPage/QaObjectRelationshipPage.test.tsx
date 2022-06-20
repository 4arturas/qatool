import { render } from '@redwoodjs/testing/web'

import QaObjectRelationshipPage from './QaObjectRelationshipPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectRelationshipPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectRelationshipPage id={'42'} />)
    }).not.toThrow()
  })
})
