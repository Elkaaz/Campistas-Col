import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  /** Si se especifica, solo usuarios con ese rol pueden acceder */
  requiredRole?: string
  /** Ruta de redireccion si no hay sesion (default: /auth) */
  redirectTo?: string
}

/**
 * ProtectedRoute — Guard de autenticacion para rutas privadas.
 * Uso en App.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/mi-perfil" element={<ProfilePage />} />
 *   </Route>
 */
export default function ProtectedRoute({
  requiredRole,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg, #0a0e1a)',
        color: 'var(--color-text, #e2e8f0)',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ fontSize: 48 }}>???</div>
        <p style={{ fontSize: 16, opacity: 0.7 }}>Cargando sesion...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  // Control de rol (ej: admin)
  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
