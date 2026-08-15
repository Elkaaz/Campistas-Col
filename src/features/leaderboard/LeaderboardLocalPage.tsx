import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCampistasByDepartamento } from '../../services/campistaProfileService'
import PerfilMiniCard from '../../components/cards/PerfilMiniCard'
import type { CampistaProfile } from '../../types'
import type { User } from '../../types'
import '../../styles/pages.css'

// Adaptador de CampistaProfile a User que espera PerfilMiniCard
function perfilToUser(p: CampistaProfile): User {
  return {
    uid: p.uid,
    displayName: p.displayName || `${p.firstName} ${p.lastName}`.trim(),
    email: p.email || '',
    avatarUrl: p.avatarUrl,
    nivel: p.nivelActual || 'semilla',
    xp: p.xpTotal || 0,
    departamento: p.departamento,
    municipio: p.municipio,
    role: p.role,
  } as User
}

export default function LeaderboardLocalPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [campistas, setCampistas] = useState<CampistaProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || !profile) { setLoading(false); return }

    const cargar = async () => {
      try {
        const data = await getCampistasByDepartamento(profile.departamento)
        // Ordenar por XP descendente
        const sorted = data.sort((a, b) => (b.xpTotal || 0) - (a.xpTotal || 0))
        setCampistas(sorted)
      } catch (err) {
        console.error('[LeaderboardLocalPage]', err)
        setCampistas([])
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user, profile, authLoading])

  const MEDALLAS = ['🥇', '🥈', '🥉']

  return (
    <div className="leaderboard-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>🌳 Ranking Local</h1>
        <p className="page-subtitle">
          Los mejores campistas de {profile?.departamento || 'tu departamento'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
          <Link to="/leaderboard" style={{
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none',
          }}>
            🌎 Global
          </Link>
          <span style={{
            padding: '6px 14px', borderRadius: 20,
            background: 'var(--color-primary, #10b981)',
            color: '#fff', fontSize: 13, fontWeight: 600,
          }}>
            🌳 Local
          </span>
        </div>
      </div>

      <div className="leaderboard-container">
        {!user ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ opacity: 0.6, marginBottom: 16 }}>Inicia sesion para ver el ranking local</p>
            <Link to="/auth" className="btn-primary">Iniciar sesion</Link>
          </div>
        ) : loading ? (
          <div className="loading"><p>Cargando ranking local...</p></div>
        ) : campistas.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <p>Aun no hay campistas en {profile?.departamento || 'tu departamento'}</p>
          </div>
        ) : (
          <div className="leaderboard-grid">
            {campistas.map((campista, index) => (
              <div key={campista.uid} className="leaderboard-item-wrapper">
                {index < 3 && <div className="medal-badge">{MEDALLAS[index]}</div>}
                <PerfilMiniCard user={perfilToUser(campista)} rank={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
