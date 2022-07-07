import { render } from '@redwoodjs/testing/web'
import JsoNataJsonModal from "src/components/JSONataJsonModal/JSONataJsonModal";


//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('JsoNataJsonModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<JsoNataJsonModal title={null} JSONata={null} json={null} />)
    }).not.toThrow()
  })
})
