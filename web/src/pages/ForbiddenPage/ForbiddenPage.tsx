import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ForbiddenPage = () => {
  return (
    <>
      <MetaTags title="Forbidden" description="Forbidden page" />

      <h1>ForbiddenPage</h1>
      <p>
        Find me in <code>./web/src/pages/ForbiddenPage/ForbiddenPage.tsx</code>
      </p>
      <p>
        My default route is named <code>forbidden</code>, link to me with `
        <Link to={routes.forbidden()}>Forbidden</Link>`
      </p>
    </>
  )
}

export default ForbiddenPage
