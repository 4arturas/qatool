import { render } from '@redwoodjs/testing/web'

import QaObjectsByTypeIdPage from './QaObjectsByTypeIdPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QaObjectsByTypeIdPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectsByTypeIdPage typeId={'42'} />)
    }).not.toThrow()
  })
})
