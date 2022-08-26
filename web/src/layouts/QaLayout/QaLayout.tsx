import {Link, navigate, NavLink, routes} from "@redwoodjs/router";
import 'antd/dist/antd.css';
import {DEFAULT_TABLE_PAGE_SIZE, ROLE_ADMIN, ROLE_CUSTOMER} from "src/global";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {useAuth} from "@redwoodjs/auth";
import {Toaster} from "@redwoodjs/web/toast";
import React from "react";
import Help from "src/components/Help/Help";

type QaLayoutProps = {
  children?: React.ReactNode
}

const QaLayout = ({ children }: QaLayoutProps) => {

  const { currentUser, logOut, hasRole } = useAuth()


  return <>
    <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
    <div className="rw-scaffold">
      <header className="rw-header" style={{padding:0,margin:0,width:'100%', boxShadow: '1px 2px 9px gray'}}>

        <span style={{position:"absolute", fontSize:'68px', fontWeight:'bold', fontStyle: 'italic', top: '-20px', left: '10px', color:'white', textShadow:'-1px 0 #40A9FF, 0 1px #40A9FF, 1px 0 #40A9FF, 0 -1px #40A9FF'}}>BBS</span>
        <span style={{position:"absolute", fontSize:'30px', fontWeight:"bold", top: '12px', left: '165px'}}>
          <Link to={routes.home()} style={{fontStyle:'italic', color:'#40A9FF', textShadow:'-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'}}>QA Tool</Link>
        </span>

        <table style={{backgroundColor:'#40A9FF', color:'black', width:'100%', height:'50px', verticalAlign:'bottom', fontSize:'20px'}} cellPadding={0} cellSpacing={0}>
          <tbody>
          <tr>
            <td style={{width:'370px'}}>&nbsp;</td>
            <td style={{paddingLeft:'20px', verticalAlign:'bottom'}}>
              <ul>
                { hasRole([ ROLE_ADMIN, ROLE_CUSTOMER ] ) &&
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.qaObjects({page: 1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0})}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink"
                      onClick={() => window.location.replace(routes.qaObjects({
                        page: 1,
                        pageSize: DEFAULT_TABLE_PAGE_SIZE,
                        count: 0
                      }))}
                    >
                      QA Objects
                    </NavLink>
                  </li>
                }
                { hasRole([ROLE_ADMIN, ROLE_CUSTOMER]) &&
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.experimentResults({page: 1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0})}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink">
                      Experiment Results
                    </NavLink>
                  </li>
                }
                { hasRole( [ROLE_ADMIN] ) &&
                  <>
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.organizations()}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink">
                      Organizations
                    </NavLink>
                  </li>
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.users()}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink">
                      Users
                    </NavLink>
                  </li>
                  <li style={{display: 'inline', marginRight: "20px"}}>
                    <NavLink
                      to={routes.schedulers()}
                      className="rw-link"
                      // activeMatchParams
                      activeClassName="activeLink">
                      Schedulers
                    </NavLink>
                  </li>
                  </>
                }
              </ul>
            </td>
            <td style={{width:'100px', color:'white'}}>
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
            <span style={{marginLeft:'10px'}}><Help anchor='anchorContent' size={20}/></span>

            </td>
          </tr>
          </tbody>
        </table>



    </header>
    <main style={{marginTop:'30px'}}>{children}</main>
    </div>
  </>
}

export default QaLayout
