import Timeline from './Timeline'
import {standard} from './Timeline.mock';

export const generated = () => {
  return <>
    <Timeline {...standard()} />
    <br/>
    <Timeline experimentResults={[]} incoming={null} outgoing={standard().outgoing} JSONata={standard().JSONata} />
  </>
}

export default { title: 'Components/Timeline' }
