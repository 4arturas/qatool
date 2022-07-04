import { render } from '@redwoodjs/testing/web'

import QaTreesNewPage from './QaTreesNewPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaTreesNewPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaTreesNewPage typeId={'42'} />)
    }).not.toThrow()
  })
})
