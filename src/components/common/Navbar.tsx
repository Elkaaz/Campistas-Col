import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'
import '../../styles/navbar.css'

const LEVEL_COLORS: Record<string, string> = {
  semilla:  '#8B7355',
  raiz:     '#654321',
  tallo:    '#228B22',
  hoja:     '#32CD32',
  flor:     '#FF69B4',
  fruto:    '#FF4500',
}

export default function Navbar() {
  const location = useLocation()
  const { profile } = useAuth()
  const userLevel = profile?.nivelActual ?? 'tallo'
  const levelColor = LEVEL_COLORS[userLevel] ?? '#228B22'

  return (
    <nav
      className="navbar"
      style={{
        background: `linear-gradient(90deg, ${levelColor} 0%, ${levelColor}dd 100%)`,
        borderBottom: `3px solid rgba(255,255,255,0.15)`,
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

        {/* USUARIO + NIVEL */}
        <div className="navbar-user">
          <div className="user-level-badge">
            <img
              src={`/images/niveles/${userLevel}.png`}
              alt={userLevel}
              className="user-level-img"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span className="user-level-name">{userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}</span>
          </div>
          <Link to="/mi-perfil" className="user-menu-button">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.displayName} className="user-avatar-img" />
            ) : (
              <span className="user-avatar-placeholder">👤</span>
            )}
            <span className="user-name">{profile?.displayName ?? 'Usuario'}</span>
          </Link>
        </div>

      </div>
    </nav>
  )
}
