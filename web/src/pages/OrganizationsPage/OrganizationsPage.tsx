import { MetaTags } from '@redwoodjs/web'
import OrganizationsCell from 'src/components/Organizations/OrganizationsCell'

const OrganizationsPage = () => {
  return (
    <>
      <MetaTags title="Organizations" description="Organizations page" />

      <OrganizationsCell/>
    </>
  )
}

export default OrganizationsPage
