import QaObjectRelationship from './QaObjectRelationship'
import {standard} from "src/layouts/QaObjectRelationshipLayout/pages/components/Relationship/QaObjectRelationship/QaObjectRelationship.mock";

export const generated = () => {
  return <QaObjectRelationship qaObject={standard().qaObject}/>
}

export default { title: 'Components/QaObjectRelationship' }
