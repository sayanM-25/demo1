import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const emptyRegister = {
  name: "",
  email: "",
  password: "",
};

const emptyLogin = {
  email: "",
  password: "",
};

function PasswordToggleIcon({ isVisible }) {
  if (isVisible) {
    return (
      <svg
        aria-hidden="true"
        className="password-toggle__icon"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3l18 18M10.6 10.7a2 2 0 102.8 2.8M9.9 5.1A10.7 10.7 0 0112 5c5 0 8.9 3.3 10 7-0.4 1.4-1.4 2.8-2.8 4M14.1 18.9c-0.7 0.1-1.4 0.1-2.1 0.1-5 0-8.9-3.3-10-7 0.5-1.7 1.8-3.3 3.7-4.6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="password-toggle__icon"
      viewBox="0 0 24 24"
    >
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        fill="none"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function AuthPage() {
  const { login, register, token, user, isLoading } = useAuth();
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  if (token && !isLoading) {
    return <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      if (mode === "register") {
        await register(registerForm);
      } else {
        await login(loginForm);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-layout">
        <div className="dashboard-hero">
          <Link className="brand" to="/">
            <span className="brand__mark">TL</span>
            Trustlytics
          </Link>
          <span className="eyebrow" style={{ marginTop: "1.5rem" }}>
            Secure workspace access
          </span>
          <h1>Register or sign in to your business dashboard.</h1>
          <p className="section-copy">
            Passwords are hashed on the server, sessions use JWT, and admin
            access is role-protected.
          </p>
          <div className="info-grid" style={{ marginTop: "1.5rem" }}>
            <div className="info-card">
              <h3>What you can do</h3>
              <p className="section-copy">
                View your private dashboard and check your details
              </p>
            </div>
            <div className="info-card">
              <h3>Admin</h3>
              <p className="section-copy">
                {/* Set `ADMIN_EMAIL` in the backend `.env` so that account becomes
                the admin user automatically. */}
                View your private dashboard and, if you are an admin, review all
                contact submissions.
              </p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="tab-toggle">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
              type="button"
            >
              Register
            </button>
          </div>

          <h2>{mode === "register" ? "Create account" : "Welcome back"}</h2>
          <p className="section-copy" style={{ marginBottom: "1.2rem" }}>
            {mode === "register"
              ? "Set up a user account to access the dashboard."
              : "Sign in with your registered email and password."}
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <>
                <div className="field">
                  <label htmlFor="register-name">Full name</label>
                  <input
                    id="register-name"
                    type="text"
                    value={registerForm.name}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="register-password">Password</label>
                  <div className="password-input">
                    <input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      minLength="6"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      aria-label={
                        showRegisterPassword ? "Hide password" : "Show password"
                      }
                      className="password-toggle"
                      onClick={() =>
                        setShowRegisterPassword((current) => !current)
                      }
                      type="button"
                    >
                      <PasswordToggleIcon isVisible={showRegisterPassword} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="login-password">Password</label>
                  <div className="password-input">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                      className="password-toggle"
                      onClick={() =>
                        setShowLoginPassword((current) => !current)
                      }
                      type="button"
                    >
                      <PasswordToggleIcon isVisible={showLoginPassword} />
                    </button>
                  </div>
                </div>
              </>
            )}

            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Login"}
            </button>
            <p className={`feedback ${status.type}`}>{status.message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
