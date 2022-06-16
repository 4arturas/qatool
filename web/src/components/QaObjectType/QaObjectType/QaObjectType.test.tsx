import { render, screen } from '@redwoodjs/testing/web'

import QaObjectType from './QaObjectType'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectType', () => {
  it('renders successfully', () => {
    const qaObjectType = {id:1, name: 'QaObjectType Test'};
    expect(() => {
      render(<QaObjectType qaObjectType={qaObjectType}/>)
    }).not.toThrow()

    expect( screen.getByText(qaObjectType.name) ).toBeInTheDocument();

  })
})
