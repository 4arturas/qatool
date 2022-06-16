import { render } from '@redwoodjs/testing/web'

import QaObjectTypeForm from './QaObjectTypeForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectTypeForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectTypeForm />)
    }).not.toThrow()
  })
})
