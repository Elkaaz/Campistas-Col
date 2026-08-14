import { useState, useEffect } from 'react'
import PerfilMiniCard from '../../components/cards/PerfilMiniCard'
import { User } from '../../types'
import { profileService } from '../../services'
import '../../styles/pages.css'

/**
 * LeaderboardPage - Leaderboard Global
 * Ranking de campistas por XP total
 */
export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar usuarios desde Firebase
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await profileService.getLeaderboard(100)
        setUsers(data)
      } catch (err) {
        console.error('Error loading leaderboard:', err)
        setError('Error al cargar ranking')
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  return (
    <div className="leaderboard-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>🏆 Leaderboard Global</h1>
        <p className="page-subtitle">Ranking de campistas por XP total</p>
      </div>

      {/* CONTENT */}
      <div className="leaderboard-container">
        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <p>Cargando ranking...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No hay campistas aún</p>
          </div>
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
