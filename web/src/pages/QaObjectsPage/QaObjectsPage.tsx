import { MetaTags } from '@redwoodjs/web'
import SearchQaObjects from "src/components/SearchQaObjects/SearchQaObjects";

const QaObjectsPage = ( {page, pageSize} ) => {
  return (
    <>
      <MetaTags title="QaObjects" description="QaObjects page" />

      <SearchQaObjects currentPage={page} pageSize={pageSize} />
    </>
  )
}

export default QaObjectsPage
