import { render } from '@redwoodjs/testing/web'

import ObjectTypePage from './ObjectTypePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ObjectTypePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ObjectTypePage />)
    }).not.toThrow()
  })
})
