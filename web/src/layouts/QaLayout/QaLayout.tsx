import { NavLink, routes} from "@redwoodjs/router";
import 'antd/dist/antd.css';
import {TABLE_PAGE_SIZE} from "src/global";

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
            <td><h1 className="rw-heading rw-heading-primary">BBS QA Tool</h1></td>
            <td style={{paddingLeft:'20px'}}>
              <ul>
                <li style={{display:'inline', marginRight: "20px"}}>
                  <NavLink
                    to={routes.home()}
                    className="rw-link"
                    // activeMatchParams
                    activeClassName="activeLink">
                    Home
                  </NavLink>
                </li>
                <li style={{display:'inline', marginRight: "20px"}}>
                  <NavLink
                    to={routes.messages({page:1, pageSize: TABLE_PAGE_SIZE})}
                    className="rw-link"
                    activeClassName="activeLink">
                    Messages
                  </NavLink>
                </li>
                <li style={{display:'inline', marginRight: "20px"}}>
                  <NavLink
                    to={routes.tmpQaObject({page:1,pageSize:10})}
                    className="rw-link"
                    activeClassName="activeLink">
                    Test
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
