import { render } from '@redwoodjs/testing/web'

import Merge from './Merge'
import {standard} from "src/components/Merge/Merge.mock";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Merge', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Merge {...standard()} />)
    }).not.toThrow()
  })
})
