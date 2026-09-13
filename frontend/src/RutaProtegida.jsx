import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RutaProtegida({ children }) {
  const { user, loading, token } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="container">Cargando...</div>
  }

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
