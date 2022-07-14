import {navigate, routes} from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import {Button, Result} from "antd";

const ForbiddenPage = () => {
  return (
    <>
      <MetaTags title="Forbidden" description="Forbidden page" />

      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={()=>navigate(routes.home())}>Back Home</Button>}
      />

    </>
  )
}

export default ForbiddenPage
