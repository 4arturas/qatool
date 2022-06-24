import { render } from '@redwoodjs/testing/web'

import QaObjectRelationship from './QaObjectRelationship'
import {standard} from "src/layouts/QaObjectRelationshipLayout/pages/components/Relationship/QaObjectRelationship/QaObjectRelationship.mock";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QaObjectRelationship', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QaObjectRelationship qaObject={standard().qaObject}/>)
    }).not.toThrow()
  })
})
