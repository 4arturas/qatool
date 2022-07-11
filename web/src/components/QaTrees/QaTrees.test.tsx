import { render } from '@redwoodjs/testing/web'

import QaTrees from './QaTrees'
import {COLLECTION} from "src/global";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaTrees', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaTrees typeId={COLLECTION}/>)
    }).not.toThrow()
  })
})
