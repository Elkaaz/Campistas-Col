import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PerfilMiniCard from '../../components/cards/PerfilMiniCard'
import { profileService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { User } from '../../types'
import '../../styles/pages.css'

/**
 * LeaderboardLocalPage - Ranking de campistas del municipio
 */
export default function LeaderboardLocalPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    profileService
      .getLeaderboardLocal(profile.municipio, 50)
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [profile?.municipio])

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>🌳 Ranking de {profile?.municipio ?? 'mi bosque'}</h1>
        <p className="page-subtitle">
          Los campistas con más XP de tu municipio · <Link to="/leaderboard">Ver ranking global</Link>
        </p>
      </div>

      <div className="leaderboard-container">
        {loading ? (
          <div className="loading"><p>Cargando ranking...</p></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><p>No hay campistas en tu municipio aún</p></div>
        ) : (
          <div className="leaderboard-grid">
            {users.map((user, index) => (
              <div key={user.uid} className="leaderboard-item-wrapper">
                {index < 3 && <div className="medal-badge">{['🥇', '🥈', '🥉'][index]}</div>}
                <PerfilMiniCard user={user} rank={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
