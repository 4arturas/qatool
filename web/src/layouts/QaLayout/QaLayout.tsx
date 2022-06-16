import {Link, routes} from "@redwoodjs/router";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {
  return <>
    <header>
      <h1>QA Toll</h1>
      <ul>
        <li><Link to={routes.home()}>Home</Link></li>
        <li><Link to={routes.objectTypes()}>Object Types</Link></li>
      </ul>
    </header>
    <main>{children}</main>
  </>
}

export default QaLayout
