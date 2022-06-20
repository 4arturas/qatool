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
import QaObjectsLayout from "src/layouts/QaObjectsLayout";
import HomePage from "src/pages/HomePage/HomePage";
import QaTreesPage from './pages/QaTreesPage/QaTreesPage';

const Routes = () => {
  return (
    <Router>

      <Set wrap={QaLayout}>

        <Set wrap={QaObjectsLayout}>
          <Route path="/qa-objects/new" page={QaObjectNewQaObjectPage} name="newQaObject" />
          <Route path="/qa-objects/{id:Int}/edit" page={QaObjectEditQaObjectPage} name="editQaObject" />
          <Route path="/qa-objects/{id:Int}" page={QaObjectQaObjectPage} name="qaObject" />
          <Route path="/qa-objects" page={QaObjectQaObjectsPage} name="qaObjects" />
          <Route path="/qa-trees" page={QaTreesPage} name="qaTrees" />
        </Set>

        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
