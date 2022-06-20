import {Link, routes} from "@redwoodjs/router";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {
  return <>
    <div className="rw-scaffold">
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">QA Tool</h1>
      <ul>
        <li style={{display:'inline', marginRight: "20px"}}>
          <Link to={routes.home()} className="rw-link">Home</Link>
        </li>
        <li style={{display:'inline', marginRight: "20px"}}>
          <Link to={routes.qaObjects()} className="rw-link">QA Objects</Link>
        </li>
        <li style={{display:'inline', marginRight: "20px"}}>
          <Link to={routes.qaTrees()} className="rw-link">QA Objects Tree</Link>
        </li>
      </ul>
    </header>
    <main>{children}</main>
    </div>
  </>
}

export default QaLayout
