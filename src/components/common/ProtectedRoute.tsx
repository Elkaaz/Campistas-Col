import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Protege las rutas de la app. En modo demo el acceso siempre está permitido
 * para que el prototipo se pueda navegar sin backend.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-state">
        <p>Cargando…</p>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
}
