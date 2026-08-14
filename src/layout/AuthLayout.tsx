import { Outlet } from 'react-router-dom'
import '../styles/layout.css'

/**
 * Layout para páginas de autenticación (sin navbar ni sidebar)
 */
export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  )
}
