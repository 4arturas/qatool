// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'
import QaObjectRelationshipsLayout from 'src/layouts/QaObjectRelationshipsLayout'
import QaLayout from "src/layouts/QaLayout/QaLayout";

const Routes = () => {
  return (
    <Router>
      <Set wrap={QaObjectRelationshipsLayout}>
        <Route path="/qa-object-relationships/new" page={QaObjectRelationshipNewQaObjectRelationshipPage} name="newQaObjectRelationship" />
        <Route path="/qa-object-relationships/{id:Int}/edit" page={QaObjectRelationshipEditQaObjectRelationshipPage} name="editQaObjectRelationship" />
        <Route path="/qa-object-relationships/{id:Int}" page={QaObjectRelationshipQaObjectRelationshipPage} name="qaObjectRelationship" />
        <Route path="/qa-object-relationships" page={QaObjectRelationshipQaObjectRelationshipsPage} name="qaObjectRelationships" />
      </Set>
      <Set wrap={QaLayout}>
        <Route path="/object-types" page={ObjectTypesPage} name="objectTypes" />
        <Route path="/object-type/{id:Int}" page={ObjectTypePage} name="objectType" />

        <Route path="/qa-objects/new" page={QaObjectNewQaObjectPage} name="newQaObject" />
        <Route path="/qa-objects/{id:Int}/edit" page={QaObjectEditQaObjectPage} name="editQaObject" />
        <Route path="/qa-objects/{id:Int}" page={QaObjectQaObjectPage} name="qaObject" />
        <Route path="/qa-objects" page={QaObjectQaObjectsPage} name="qaObjects" />

        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
