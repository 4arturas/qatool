import { render } from '@redwoodjs/testing/web'

import QaTree from './QaTree'
import {COLLECTION} from "src/global";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaTree', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaTree typeId={COLLECTION}/>)
    }).not.toThrow()
  })
})
