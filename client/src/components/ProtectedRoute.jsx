import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { isLoading, token } = useAuth()

  if (isLoading) {
    return <div className="page-shell"><div className="container section"><p>Loading your workspace...</p></div></div>
  }

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  return children
}
