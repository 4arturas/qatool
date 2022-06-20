import { render } from '@redwoodjs/testing/web'

import QaObjectTree from './QaObjectTree'
import {COLLECTION} from "src/global";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectTree', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectTree typeId={COLLECTION}/>)
    }).not.toThrow()
  })
})
