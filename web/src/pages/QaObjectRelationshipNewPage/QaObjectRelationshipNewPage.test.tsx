import { render } from '@redwoodjs/testing/web'

import QaObjectRelationshipNewPage from './QaObjectRelationshipNewPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectRelationshipNewPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectRelationshipNewPage parentId={'42'} />)
    }).not.toThrow()
  })
})
