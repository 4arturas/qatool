import {Link, routes} from "@redwoodjs/router";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {
  return <>
    <header>
      <h1>QA Tool</h1>
      <ul>
        <li style={{display:'inline', marginRight: "20px"}}><Link to={routes.home()}>Home</Link></li>
        <li style={{display:'inline', marginRight: "20px"}}><Link to={routes.objectTypes()}>Object Types</Link></li>
        <li style={{display:'inline', marginRight: "20px"}}><Link to={routes.qaObjects()}>QA Objects</Link></li>
      </ul>
    </header>
    <main>{children}</main>
  </>
}

export default QaLayout
