import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type QaObjectRelationshipLayoutProps = {
  children: React.ReactNode
}

const QaObjectRelationshipsLayout = ({ children }: QaObjectRelationshipLayoutProps) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link
            to={routes.qaObjectRelationships()}
            className="rw-link"
          >
            QaObjectRelationships
          </Link>
        </h1>
        <Link
          to={routes.newQaObjectRelationship()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New QaObjectRelationship
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default QaObjectRelationshipsLayout
