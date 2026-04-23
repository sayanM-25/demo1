import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <Link className="brand" to="/">
            <span className="brand__mark">TL</span>
            Trustlytics
          </Link>
          <div className="header-actions">
            {user?.isAdmin ? (
              <Link className="button-secondary" to="/admin">
                Admin view
              </Link>
            ) : null}
            <button className="button-ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-hero">
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome, {user?.name || 'User'}.</h1>
          <p className="section-copy">
            This authenticated space confirms the login flow, secure session
            handling, and role-aware navigation.
          </p>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <h2>Your account</h2>
            <div className="form-grid">
              <div className="info-card">
                <h3>Name</h3>
                <p className="section-copy">{user?.name}</p>
              </div>
              <div className="info-card">
                <h3>Email</h3>
                <p className="section-copy">{user?.email}</p>
              </div>
              <div className="info-card">
                <h3>Role</h3>
                <p className="section-copy">
                  {user?.isAdmin ? 'Admin' : 'Standard user'}
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <h2>Platform summary</h2>
            <div className="form-grid">
              <div className="info-card">
                <h3>Frontend</h3>
                <p className="section-copy">React + Vite responsive interface.</p>
              </div>
              <div className="info-card">
                <h3>Backend</h3>
                <p className="section-copy">Express REST APIs with JWT auth.</p>
              </div>
              <div className="info-card">
                <h3>Database</h3>
                <p className="section-copy">MongoDB for users and contacts.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
