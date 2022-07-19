import { render } from '@redwoodjs/testing/web'

import OrganizationEdit from './OrganizationEdit'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrganizationEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrganizationEdit />)
    }).not.toThrow()
  })
})
