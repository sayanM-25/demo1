import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

export function HomePage() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await api.submitContact(form)
      setForm(initialForm)
      setStatus({
        type: 'success',
        message: 'Message received. We will get back to you shortly.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top">
            <span className="brand__mark">TL</span>
            Trustlytics
          </a>
          <nav className="header-nav">
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <Link className="button-secondary" to="/auth">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="container hero">
          <div className="hero-copy">
            <span className="eyebrow">Business clarity for growing teams</span>
            <h1>Trustlytics helps small businesses turn contact into momentum.</h1>
            <p className="section-copy">
              A clean client-facing experience on the front, protected business
              workflows on the back, and one place to track every incoming lead.
            </p>
            <div className="hero-actions">
              <a className="button" href="#contact">Send a message</a>
              <Link className="button-ghost" to="/auth">
                Open dashboard
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="muted">Lead capture</span>
                <strong>24/7</strong>
              </div>
              <div className="stat-card">
                <span className="muted">Secure access</span>
                <strong>JWT</strong>
              </div>
              <div className="stat-card">
                <span className="muted">Database backed</span>
                <strong>MongoDB</strong>
              </div>
            </div>
          </div>

          <div className="hero-panel stat-card">
            <div className="panel-top">
              <div>
                <p className="muted">Operations overview</p>
                <strong>Business pulse</strong>
              </div>
              <span className="pill pill-success">Live-ready</span>
            </div>
            <div className="metric-grid">
              <div className="metric-card">
                <span className="muted">Auth flow</span>
                <strong>Ready</strong>
              </div>
              <div className="metric-card">
                <span className="muted">REST APIs</span>
                <strong>3 core</strong>
              </div>
              <div className="metric-card">
                <span className="muted">Admin view</span>
                <strong>Included</strong>
              </div>
              <div className="metric-card">
                <span className="muted">Responsive UI</span>
                <strong>Mobile+</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="container section" id="about">
          <div className="section-heading">
            <div>
              <span className="eyebrow">About us</span>
              <h2>Built for practical business workflows.</h2>
            </div>
            <p className="section-copy">
              Trustlytics gives teams a polished first impression and the
              operational basics they need after login.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <span className="pill pill-neutral">Landing page</span>
              <h3>Clear company story</h3>
              <p className="section-copy">
                Present your business with a crisp homepage, strong copy, and
                responsive layout.
              </p>
            </article>
            <article className="feature-card">
              <span className="pill pill-neutral">Authentication</span>
              <h3>Protected user area</h3>
              <p className="section-copy">
                Users can register, log in securely, and access a private
                dashboard experience.
              </p>
            </article>
            <article className="feature-card">
              <span className="pill pill-neutral">Admin panel</span>
              <h3>Lead visibility</h3>
              <p className="section-copy">
                Admins can review contact submissions without digging through a
                mailbox or spreadsheet.
              </p>
            </article>
          </div>
        </section>

        <section className="container section" id="contact">
          <div className="contact-layout">
            <div className="contact-card">
              <span className="eyebrow">Contact</span>
              <h2>Start the conversation</h2>
              <p className="section-copy">
                Share your name, email, and message. Every submission is stored
                in MongoDB and available in the admin dashboard.
              </p>
              <div className="stack">
                <div className="info-card">
                  <h3>Fast follow-up</h3>
                  <p className="section-copy">
                    Perfect for customer inquiries, partnership requests, or
                    early sales outreach.
                  </p>
                </div>
              </div>
            </div>

            <form className="contact-card form-grid" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="6"
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  required
                />
              </div>
              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit message'}
              </button>
              <p className={`feedback ${status.type}`}>{status.message}</p>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
