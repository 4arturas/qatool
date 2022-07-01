import QaTrees from "src/layouts/QaTreeLayout/components/Tree/QaTrees/QaTrees";
import {COLLECTION, SERVER} from "src/global";

type QaTreeLayoutProps = {
  children?: React.ReactNode
}

const QaTreeLayout = ({ children }: QaTreeLayoutProps) => {
  return <>{children}</>

}

export default QaTreeLayout
