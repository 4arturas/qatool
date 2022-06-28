import { MetaTags } from '@redwoodjs/web'
import MessagesCell from 'src/components/MessagesCell'

const MessagesPage = ({page, pageSize}) => {
  return (
    <>
      <MetaTags title="Messages" description="Messages page" />

      <MessagesCell page={page} pageSize={pageSize}/>
    </>
  )
}

export default MessagesPage
