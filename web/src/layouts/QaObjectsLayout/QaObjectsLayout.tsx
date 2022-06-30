import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type QaObjectLayoutProps = {
  children: React.ReactNode
}

const QaObjectsLayout = ({ children }: QaObjectLayoutProps) => {
  return (
      <main>{children}</main>
  )
}

export default QaObjectsLayout
