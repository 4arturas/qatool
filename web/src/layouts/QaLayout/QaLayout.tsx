import {navigate, NavLink, routes} from "@redwoodjs/router";
import 'antd/dist/antd.css';
import {DEFAULT_TABLE_PAGE_SIZE} from "src/global";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {useAuth} from "@redwoodjs/auth";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {

  const { currentUser, logOut, hasRole } = useAuth()

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
                    to={routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0} )}
                    className="rw-link"
                    // activeMatchParams
                    activeClassName="activeLink"
                    onClick={()=>window.location.replace(routes.qaObjects( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0} ))}
                  >
                    QA Objects
                  </NavLink>
                </li>
                <li style={{display:'inline', marginRight: "20px"}}>
                  <NavLink
                    to={routes.experimentResults( {page:1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0} )}
                    className="rw-link"
                    // activeMatchParams
                    activeClassName="activeLink">
                    Experiment Results
                  </NavLink>
                </li>
                { hasRole( ['admin'] ) &&
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.users()}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink">
                      Users
                    </NavLink>
                  </li>
                }
              </ul>
            </td>
          </tr>
          </tbody>
        </table>

        <span>
          {
            currentUser ?
            <>
              { currentUser.email }&nbsp;{/*{ hasRole( ['admin', 'customer']) ? 'HAS ROLE':'NO ROLE' }*/}
              <Tooltip title={'Logout'}>
                <LogoutOutlined style={{fontSize: '20px'}} onClick={()=>logOut()}/>
              </Tooltip>
            </>
            :
              <Tooltip title={'Login'}>
                <LoginOutlined style={{fontSize: '20px'}} onClick={()=>navigate(routes.login())}/>
              </Tooltip>
          }
        </span>

    </header>
    <main>{children}</main>
    </div>
  </>
}

export default QaLayout
