import { Link } from 'react-router-dom'
import { User, NivelActual } from '../../types'
import { getLevelColor } from '../../lib/colors'
import NivelBadge from './NivelBadge'
import '../../styles/components.css'

interface PerfilMiniCardProps {
  user: User
  rank?: number
  onVisitProfile?: (uid: string) => void
}

/**
 * PerfilMiniCard - Card mini del perfil de un usuario
 * Usado en leaderboard, sidebar, comunidad local
 */
export default function PerfilMiniCard({
  user,
  rank,
  onVisitProfile,
}: PerfilMiniCardProps) {
  return (
    <Link
      to={`/perfiles/${user.uid}`}
      className="perfil-mini-card"
      onClick={() => onVisitProfile?.(user.uid)}
    >
      {rank && <div className="rank-badge">#{rank}</div>}

      {user.avatar ? (
        <img src={user.avatar} alt={user.displayName} className="perfil-avatar" />
      ) : (
        <div className="perfil-avatar-placeholder">👤</div>
      )}

      <div className="perfil-info">
        <h4>{user.displayName}</h4>
        <p className="perfil-location">📍 {user.municipio}</p>

        <div className="perfil-stats">
          <span className="stat-badge">
            <span className="stat-icon">⭐</span>
            {user.xpTotal}
          </span>
        </div>

        <NivelBadge nivel={user.nivelActual} size="small" showName={false} />
      </div>
    </Link>
  )
}
