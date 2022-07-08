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
import QaTreesPage from './pages/QaTreesPage/QaTreesPage';
import QaTreeLayout from "src/layouts/QaTreeLayout/QaTreeLayout";

import QaObjectRelationshipLayout from "src/layouts/QaObjectRelationshipLayout/QaObjectRelationshipLayout";
import QaObjectMergePage from './layouts/QaObjectRelationshipLayout/pages/QaObjectMergePage/QaObjectMergePage';

const Routes = () => {
  return (
    <Router>

      <Set wrap={QaLayout}>

        {/*<Set wrap={QaObjectsLayout}>
          <Route path="/qa-objects/new" page={QaObjectNewQaObjectPage} name="newQaObject" />
          <Route path="/qa-objects/{id:Int}/edit" page={QaObjectEditQaObjectPage} name="editQaObject" />
          <Route path="/qa-objects/{id:Int}" page={QaObjectQaObjectPage} name="qaObject" />
          <Route path="/qa-objects" page={QaObjectQaObjectsPage} name="qaObjects" />

        </Set>*/}

        <Set wrap={QaTreeLayout}>
          <Route path="/" page={HomePage} name="home" />
          <Route path="/qa-objects/{page:Int}/{pageSize:Int}" page={QaObjectsPage} name="qaObjects" />
          <Route path="/qa-trees" page={QaTreesPage} name="qaTrees" />
          {/*<Route path="/qa-trees/{typeId:Int}/show" page={QaObjectsByTypeIdPage} name="qaObjectsByTypeId" />*/}
          {/*<Route path="/qa-trees/{typeId:Int}/new" page={QaTreesNewPage} name="qaTreeNew" />*/}
          <Route path="/experiment/{id:Int}" page={ExperimentPage} name="experiment" />
          <Route path="/experiments/{page:Int}/{pageSize:Int}/{count:Int}" page={ExperimentResultsPage} name="experimentResults" />
        </Set>

        <Set wrap={QaObjectRelationshipLayout}>
          <Route path="/relationship/{id:Int}" page={QaObjectRelationshipPage} name="qaObjectRelationship" />
          <Route path="/relationship/{parentId:Int}/new/{typeId:Int}/type" page={QaObjectRelationshipNewPage} name="qaObjectRelationshipNew" />
          <Route path="/qa-object-merge/{parentId:Int}" page={QaObjectMergePage} name="qaObjectMerge" />
        </Set>


      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
