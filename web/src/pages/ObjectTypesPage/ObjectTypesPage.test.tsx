import { render } from '@redwoodjs/testing/web'

import ObjectTypesPage from './ObjectTypesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ObjectTypesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectTypesPage />)
    }).not.toThrow()
  })
})
