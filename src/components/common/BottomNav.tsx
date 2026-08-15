import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAV_ITEMS_BOTTOM } from '../../lib/constants'
import './BottomNav.css'

export default function BottomNav() {
  const location = useLocation()
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS_BOTTOM.map((item) => {
        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label.split(' ')[0]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
