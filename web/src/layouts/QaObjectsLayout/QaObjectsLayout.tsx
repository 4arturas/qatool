import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type QaObjectLayoutProps = {
  children: React.ReactNode
}

const QaObjectsLayout = ({ children }: QaObjectLayoutProps) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 3000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link
            to={routes.qaObjects()}
            className="rw-link"
          >
            QaObjects
          </Link>
        </h1>
        <Link
          to={routes.newQaObject()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New QaObject
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default QaObjectsLayout
