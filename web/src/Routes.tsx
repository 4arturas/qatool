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
import QaObjectsLayout from "src/layouts/QaObjectsLayout/QaObjectsLayout";

const Routes = () => {
  return (
    <Router>
      <Set wrap={QaObjectsLayout}>
        <Route path="/qa-objects/new" page={QaObjectNewQaObjectPage} name="newQaObject" />
        <Route path="/qa-objects/{id:Int}/edit" page={QaObjectEditQaObjectPage} name="editQaObject" />
        <Route path="/qa-objects/{id:Int}" page={QaObjectQaObjectPage} name="qaObject" />
        <Route path="/qa-objects" page={QaObjectQaObjectsPage} name="qaObjects" />
      </Set>
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
