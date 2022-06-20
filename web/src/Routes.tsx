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
import QaTreeLayout from "src/layouts/QaTreeLayout/QaTreeLayout";

const Routes = () => {
  return (
    <Router>

      <Set wrap={QaLayout}>

        <Set wrap={QaObjectsLayout}>
          <Route path="/qa-objects/new" page={QaObjectNewQaObjectPage} name="newQaObject" />
          <Route path="/qa-objects/{id:Int}/edit" page={QaObjectEditQaObjectPage} name="editQaObject" />
          <Route path="/qa-objects/{id:Int}" page={QaObjectQaObjectPage} name="qaObject" />
          <Route path="/qa-objects" page={QaObjectQaObjectsPage} name="qaObjects" />
        </Set>

        <Set wrap={QaTreeLayout}>
          <Route path="/qa-trees" page={QaTreesPage} name="qaTrees" />
          <Route path="/qa-trees/{typeId:Int}" page={QaObjectsByTypeIdPage} name="qaObjectsByTypeId" />
          <Route path="/qa-trees/{typeId}/new" page={QaTreesNewPage} name="qaTreeNew" />
        </Set>

        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
