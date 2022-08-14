import MergeModal from './MergeModal'
import {standard} from "src/components/MergeModal/MergeModal.mock";

export const generated = () => {
  return <MergeModal {...standard()} />
}

export default { title: 'Components/MergeModal' }
