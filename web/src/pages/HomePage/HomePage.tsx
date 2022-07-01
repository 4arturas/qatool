import { MetaTags } from '@redwoodjs/web'
import QaTreesPage from "src/pages/QaTreesPage/QaTreesPage";
import {DEFAULT_PAGE_SIZE} from "src/global";
import SearchQaObjects from "src/components/SearchQaObjects/SearchQaObjects";

const HomePage = ( { page = 1, pageSize = DEFAULT_PAGE_SIZE }) => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <SearchQaObjects currentPage={page} pageSize={pageSize} />
    </>
  )
}

export default HomePage
