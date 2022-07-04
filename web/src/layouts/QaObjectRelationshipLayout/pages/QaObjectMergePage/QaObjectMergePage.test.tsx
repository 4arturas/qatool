import { render } from '@redwoodjs/testing/web'

import QaObjectMergePage from './QaObjectMergePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectMergePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectMergePage parentId={42} />)
    }).not.toThrow()
  })
})
