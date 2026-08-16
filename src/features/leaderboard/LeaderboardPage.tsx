import { useState, useEffect } from 'react'
import PerfilMiniCard from '../../components/cards/PerfilMiniCard'
import { User } from '../../types'
import { profileService } from '../../services'
import '../../styles/pages.css'

/**
 * LeaderboardPage - Ranking Global
 * Ranking de campistas por XP total (REAL-TIME)
 */
export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time listener for leaderboard
  useEffect(() => {
    setLoading(true)
    setError(null)

    let unsubscribe: () => void = () => {}

    try {
      // Subscribe to real-time leaderboard updates
      unsubscribe = profileService.subscribeLeaderboard((data) => {
        setUsers(data)
        setLoading(false)
      }, 100) as () => void
    } catch (err) {
      console.error('Error setting up leaderboard listener:', err)
      setError('Error al cargar ranking')
      setLoading(false)
    }

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <div className="leaderboard-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>🏆 Ranking Global</h1>
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
