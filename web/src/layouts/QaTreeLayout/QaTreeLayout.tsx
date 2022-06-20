import QaTrees from "src/components/Tree/QaTrees/QaTrees";
import {COLLECTION, SERVER} from "src/global";

type QaTreeLayoutProps = {
  children?: React.ReactNode
}

const QaTreeLayout = ({ children }: QaTreeLayoutProps) => {
  return <>
  <table style={{width:'100%'}}>
    <tbody>
    <tr>
      <td style={{verticalAlign:'top', width:'200px'}}>
        <div><QaTrees typeId={SERVER}/></div>
        <div><QaTrees typeId={COLLECTION}/></div>
      </td>
      <td style={{verticalAlign:'top'}}>{children}</td>
    </tr>
    </tbody>
  </table>
  </>
}

export default QaTreeLayout
