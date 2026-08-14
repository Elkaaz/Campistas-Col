import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PerfilMiniCard from '../../components/cards/PerfilMiniCard'
import { profileService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { User } from '../../types'
import '../../styles/pages.css'

/**
 * BosqueLocalPage - Mi Bosque
 * Comunidad local de campistas por municipio
 */
export default function BosqueLocalPage() {
  const { profile } = useAuth()
  const [campistas, setCampistas] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    profileService
      .getCampistasLocal(profile.municipio)
      .then(setCampistas)
      .finally(() => setLoading(false))
  }, [profile?.municipio])

  const xpBosque = campistas.reduce((total, campista) => total + campista.xpTotal, 0)

  return (
    <div className="bosque-page">
      <div className="page-header">
        <h1>🌳 Mi Bosque</h1>
        <p className="page-subtitle">
          Campistas de {profile?.municipio ?? 'tu municipio'}
          {profile?.departamento ? `, ${profile.departamento}` : ''}
        </p>
      </div>

      <div className="bosque-stats">
        <div className="bosque-stat">
          <span className="bosque-stat-value">{campistas.length}</span>
          <span className="bosque-stat-label">Campistas</span>
        </div>
        <div className="bosque-stat">
          <span className="bosque-stat-value">{xpBosque}</span>
          <span className="bosque-stat-label">XP del bosque</span>
        </div>
        <Link to="/leaderboard/local" className="bosque-stat bosque-stat-link">
          <span className="bosque-stat-value">🏆</span>
          <span className="bosque-stat-label">Ranking local</span>
        </Link>
      </div>

      {loading ? (
        <div className="loading"><p>Cargando tu bosque...</p></div>
      ) : campistas.length === 0 ? (
        <div className="empty-state"><p>Todavía no hay campistas en tu municipio</p></div>
      ) : (
        <div className="leaderboard-grid">
          {campistas.map((campista) => (
            <PerfilMiniCard key={campista.uid} user={campista} />
          ))}
        </div>
      )}
    </div>
  )
}
