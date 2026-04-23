import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

export function AdminPage() {
  const { token, user, logout } = useAuth()
  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function loadContacts({ silent = false } = {}) {
    if (silent) {
      setIsRefreshing(true)
    } else if (contacts.length > 0) {
      setIsLoading(true)
    }

    setStatus({ type: '', message: '' })

    try {
      const data = await api.getContacts(token)
      setContacts(data.contacts)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function initialLoad() {
      try {
        const data = await api.getContacts(token)

        if (!ignore) {
          setContacts(data.contacts)
          setStatus({ type: '', message: '' })
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message })
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    initialLoad()

    return () => {
      ignore = true
    }
  }, [token])

  const totalSubmissions = contacts.length
  const uniqueSenders = new Set(contacts.map((contact) => contact.email)).size
  const latestSubmission = contacts[0]?.createdAt
    ? new Date(contacts[0].createdAt).toLocaleString()
    : 'No submissions yet'

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <Link className="brand" to="/">
            <span className="brand__mark">TL</span>
            Trustlytics
          </Link>
          <div className="header-actions">
            <Link className="button-secondary" to="/dashboard">
              Back to dashboard
            </Link>
            <button className="button-ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-hero">
          <span className="eyebrow">Admin view</span>
          <h1>Contact submissions for {user?.name}.</h1>
          <p className="section-copy">
            Review all messages captured from the landing page contact form.
          </p>
        </section>

        <section className="info-grid admin-summary-grid">
          <article className="info-card">
            <h3>Total submissions</h3>
            <p className="admin-summary-value">{totalSubmissions}</p>
            <p className="section-copy">All contact form entries currently stored.</p>
          </article>
          <article className="info-card">
            <h3>Unique senders</h3>
            <p className="admin-summary-value">{uniqueSenders}</p>
            <p className="section-copy">Distinct email addresses that have reached out.</p>
          </article>
          <article className="info-card">
            <h3>Latest message</h3>
            <p className="admin-summary-text">{latestSubmission}</p>
            <p className="section-copy">Most recent contact form submission time.</p>
          </article>
        </section>

        <section className="table-card">
          <div className="inline-row">
            <div>
              <h2>Inbox</h2>
              <p className="section-copy">
                {isLoading
                  ? 'Loading contact submissions...'
                  : `${contacts.length} submission(s) found.`}
              </p>
            </div>
            <button
              className="button-secondary"
              onClick={() => loadContacts({ silent: true })}
              type="button"
              disabled={isLoading || isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {status.message ? <p className={`feedback ${status.type}`}>{status.message}</p> : null}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && contacts.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No submissions yet. New contact form messages will appear here.
                    </td>
                  </tr>
                ) : null}
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>
                      <strong className="table-primary">{contact.name}</strong>
                    </td>
                    <td>
                      <a className="text-link" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </td>
                    <td className="table-message">{contact.message}</td>
                    <td>{new Date(contact.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
