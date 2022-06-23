import { MetaTags } from '@redwoodjs/web'
import QaTreesPage from "src/pages/QaTreesPage/QaTreesPage";

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <QaTreesPage/>
    </>
  )
}

export default HomePage
