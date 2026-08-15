import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../../lib/constants'
import { useAuth } from '../../hooks/useAuth'
import { logoutUser } from '../../services/authService'
import '../../styles/navbar.css'

const LEVEL_COLORS: Record<string, string> = {
  semilla:   '#10b981',
  raiz:      '#3b82f6',
  tallo:     '#6366f1',
  hoja:      '#a855f7',
  flor:      '#ec4899',
  fruto:     '#f97316',
  honorario: '#f59e0b',
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const nivel = profile?.nivelActual || 'semilla'
  const levelColor = LEVEL_COLORS[nivel] ?? '#10b981'
  const nombreCorto = profile?.firstName || user?.displayName?.split(' ')[0] || 'Campista'

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutUser()
      navigate('/auth')
    } catch (e) {
      console.error('[Navbar] logout error:', e)
    } finally {
      setLoggingOut(false)
      setMenuOpen(false)
    }
  }

  return (
    <nav
      className="navbar"
      style={{
        background: `linear-gradient(90deg, ${levelColor} 0%, ${levelColor}cc 100%)`,
        borderBottom: '3px solid rgba(255,255,255,0.15)',
      }}
    >
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">
          <img
            src="/images/logos/logo-principal.png"
            alt="Campistas Col"
            className="navbar-logo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="brand-text">Campistas Col</span>
        </Link>

        {/* NAV ITEMS */}
        <div className="navbar-items">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>

        {/* USUARIO */}
        <div className="navbar-user">
          {user ? (
            <>
              {/* Badge de nivel */}
              <div className="user-level-badge">
                <img
                  src={`/images/niveles/${nivel}.png`}
                  alt={nivel}
                  className="user-level-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="user-level-name">{nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
              </div>

              {/* Menu de usuario */}
              <div style={{ position: 'relative' }}>
                <button
                  className="user-menu-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <span className="user-avatar-placeholder">
                    {profile?.avatarUrl
                      ? <img src={profile.avatarUrl} alt={nombreCorto} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      : '👤'
                    }
                  </span>
                  <span className="user-name">{nombreCorto}</span>
                  <span style={{ opacity: 0.6, fontSize: 10 }}>{menuOpen ? '▲' : '▼'}</span>
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '8px 0', minWidth: 180,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 999,
                  }}>
                    <Link
                      to="/mi-perfil"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', color: '#e2e8f0', textDecoration: 'none', fontSize: 14 }}
                    >
                      👤 Mi perfil
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', color: '#e2e8f0', textDecoration: 'none', fontSize: 14 }}
                    >
                      📊 Mi progreso
                    </Link>
                    <Link
                      to="/bosque"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', color: '#e2e8f0', textDecoration: 'none', fontSize: 14 }}
                    >
                      🌳 Mi bosque
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', color: '#fcd34d', textDecoration: 'none', fontSize: 14 }}
                      >
                        ⚙️ Administrar
                      </Link>
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '6px 0' }} />
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      style={{
                        display: 'block', width: '100%', padding: '10px 16px',
                        color: '#f87171', background: 'none', border: 'none',
                        textAlign: 'left', cursor: 'pointer', fontSize: 14,
                      }}
                    >
                      {loggingOut ? 'Saliendo...' : '🚪 Cerrar sesion'}
                    </button>
                  </div>
                )}
              </div>

              {/* XP indicator */}
              <div style={{
                fontSize: 12, opacity: 0.7, marginLeft: 4,
                display: 'flex', alignItems: 'center', gap: 2,
              }}>
                ⚡ {profile?.xpTotal?.toLocaleString() || '0'}
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              style={{
                padding: '7px 16px', borderRadius: 20,
                background: 'rgba(255,255,255,0.2)', color: '#fff',
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Entrar 🏕️
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}
