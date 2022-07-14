import { MetaTags } from '@redwoodjs/web'
import UsersCell from 'src/components/UsersCell'
const UsersPage = () => {
  return (
    <>
      <MetaTags title="Users" description="Users page" />

      <UsersCell />
    </>
  )
}

export default UsersPage
