import { NavLink, routes} from "@redwoodjs/router";
import 'antd/dist/antd.css';
import {DEFAULT_TABLE_PAGE_SIZE} from "src/global";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {
  return <>
    <div className="rw-scaffold">
      <header className="rw-header">

        <table>
          <tbody>
          <tr>
            <td>
              <h1 className="rw-heading rw-heading-primary">
                <NavLink
                  to={routes.home()}
                  className="rw-link"
                  // activeMatchParams
                  activeClassName="activeLink">
                  BBS QA Tool
                </NavLink>
              </h1>
            </td>
            <td style={{paddingLeft:'20px'}}>
              <ul>
                <li style={{display:'inline', marginRight: "20px"}}>
                  <NavLink
                    to={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE} )}
                    className="rw-link"
                    // activeMatchParams
                    activeClassName="activeLink">
                    QA Objects
                  </NavLink>
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>

    </header>
    <main>{children}</main>
    </div>
  </>
}

export default QaLayout
