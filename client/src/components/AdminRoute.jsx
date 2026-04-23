import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute({ children }) {
  const { isLoading, token, user } = useAuth()

  if (isLoading) {
    return <div className="page-shell"><div className="container section"><p>Loading admin access...</p></div></div>
  }

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
