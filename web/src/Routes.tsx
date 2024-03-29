// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'
import QaLayout from "src/layouts/QaLayout/QaLayout";


import HomePage from "src/pages/HomePage/HomePage";
import ForbiddenPage from './pages/ForbiddenPage/ForbiddenPage';
import BlocklyTreePage from "src/pages/BlocklyTreePage/BlocklyTreePage";

const Routes = () => {
  return (
    <Router>

      <Route path="/forbidden" page={ForbiddenPage} name="forbidden" />

      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />

      <Set wrap={QaLayout}>

        <Route path="/" page={HomePage} name="home" />

        <Private unauthenticated="login">

          <Route path="/qa-objects/{page:Int}/{pageSize:Int}/{count:Int}" page={QaObjectsPage} name="qaObjects" />

          <Route path="/tree/{id:Int}" page={TreePage} name="tree" />

          <Route path="/experiment/{id:Int}" page={ExperimentPage} name="experiment" />
          <Route path="/experiment-test/{testId:Int}" page={ExperimentTestPage} name="experimentTest" />
          <Route path="/experiments/{page:Int}/{pageSize:Int}/{count:Int}" page={ExperimentResultsPage} name="experimentResults" />
          <Route path="/experiment-browser/{id:Int}" page={ExperimentBrowserPage} name="experimentBrowser" />

          <Private unauthenticated="forbidden" roles={['admin']}>
            <Route path="/blockly-tree/{id:Int}" page={BlocklyTreePage} name="blocklyTree" />
            <Route path="/users" page={UsersPage} name="users" />
            <Route path="/organizations" page={OrganizationsPage} name="organizations" />

            <Route path="/schedulers" page={SchedulerSchedulersPage} name="schedulers" />

          </Private>

        </Private>
      </Set>

      <Route notfound page={NotFoundPage} />

    </Router>
  )
}

export default Routes
