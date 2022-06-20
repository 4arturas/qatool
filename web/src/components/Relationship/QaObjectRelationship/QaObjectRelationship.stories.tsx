import QaObjectRelationship from './QaObjectRelationship'
import {standard} from "src/components/Relationship/QaObjectRelationship/QaObjectRelationship.mock";

export const generated = () => {
  return <QaObjectRelationship qaObject={standard().qaObject}/>
}

export default { title: 'Components/QaObjectRelationship' }
