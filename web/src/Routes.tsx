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


import HomePage from "src/pages/HomePage/HomePage";

const Routes = () => {
  return (
    <Router>
      <Set wrap={QaLayout}>

        <Route path="/" page={HomePage} name="home" />

        <Route path="/qa-objects/{page:Int}/{pageSize:Int}" page={QaObjectsPage} name="qaObjects" />

        <Route path="/experiment/{id:Int}" page={ExperimentPage} name="experiment" />
        <Route path="/experiments/{page:Int}/{pageSize:Int}/{count:Int}" page={ExperimentResultsPage} name="experimentResults" />

        <Route path="/tree/{id:Int}" page={TreePage} name="tree" />
        
      </Set>
      
      <Route notfound page={NotFoundPage} />
      
    </Router>
  )
}

export default Routes
