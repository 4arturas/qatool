import TestRun from './TestRun'
import {standard} from "src/components/TestRun/TestRun.mock";

export const generated = () => {
  return <TestRun {...standard()}/>
}

export default { title: 'Components/TestRun' }
