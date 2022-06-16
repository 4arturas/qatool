// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'
import QaLayout from "src/layouts/QaLayout/QaLayout";

const Routes = () => {
  return (
    <Router>
      <Set wrap={QaLayout}>
        <Route path="/object-types" page={ObjectTypesPage} name="objectTypes" />
        <Route path="/object-type/{id:Int}" page={ObjectTypePage} name="objectType" />
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
