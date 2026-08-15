import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCampistasByDepartamento } from '../../services/campistaProfileService'
import { getPublicacionesPendientes } from '../../services/retosService'
import type { CampistaProfile } from '../../types'
import '../../styles/pages.css'

// Simular el progreso en XP hacia el siguiente nivel. En un entorno real se obtendrian los umbrales de Firestore.
function getXpProgress(xp: number) {
  const thresholds = [
    { name: 'semilla', min: 0, max: 100 },
    { name: 'raiz', min: 100, max: 300 },
    { name: 'tallo', min: 300, max: 600 },
    { name: 'hoja', min: 600, max: 1000 },
    { name: 'flor', min: 1000, max: 1500 },
    { name: 'fruto', min: 1500, max: 2500 },
    { name: 'honorario', min: 2500, max: Infinity },
  ]
  const currentLevel = thresholds.find(t => xp >= t.min && xp < t.max) || thresholds[0]
  const nextLevel = thresholds.find(t => t.min === currentLevel.max)
  const percent = nextLevel
    ? Math.min(100, Math.max(0, ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100))
    : 100

  return { currentLevel, nextLevel, percent }
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [leaderboard, setLeaderboard] = useState<CampistaProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || !profile) { setLoading(false); return }

    const cargar = async () => {
      try {
        const campistasData = await getCampistasByDepartamento(profile.departamento)
        const sorted = campistasData.sort((a, b) => (b.xpTotal || 0) - (a.xpTotal || 0)).slice(0, 5)
        setLeaderboard(sorted)
      } catch (err) {
        console.error('[DashboardPage]', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user, profile, authLoading])

  if (authLoading || loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.6 }}>Cargando dashboard...</div>
  if (!user || !profile) return <div style={{ padding: 40, textAlign: 'center' }}>Por favor inicia sesion para ver tu progreso.</div>

  const userXp = profile.xpTotal || 0
  const { currentLevel, nextLevel, percent } = getXpProgress(userXp)

  const stats = [
    { label: 'XP total', value: String(userXp) },
    { label: 'Nivel actual', value: currentLevel.name.charAt(0).toUpperCase() + currentLevel.name.slice(1) },
    { label: 'Ubicacion', value: profile.municipio || 'Sin definir' },
    { label: 'Rol', value: profile.role.replace('_', ' ') },
  ]

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Mi Progreso</span>
          <h1>Dashboard Campista</h1>
        </div>
        <Link to="/mi-perfil" className="primary-button button-link">Editar perfil</Link>
      </div>

      <section className="stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24
      }}>
        {stats.map((item) => (
          <article className="card stat-card" key={item.label} style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 16, borderRadius: 12, textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.6 }}>{item.label}</p>
            <strong style={{ fontSize: 20 }}>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24
      }}>
        <article className="card" style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 24, borderRadius: 12
        }}>
          <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Progreso de Nivel</h2>
          <div className="progress-box">
            <div className="progress-bar" style={{
              height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 12
            }}>
              <span style={{ 
                display: 'block', height: '100%', width: `${percent}%`, 
                background: 'var(--color-primary, #10b981)', borderRadius: 6 
              }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>
              {Math.round(percent)}% hacia {nextLevel ? nextLevel.name.charAt(0).toUpperCase() + nextLevel.name.slice(1) : 'maximo nivel'}
            </p>
            {nextLevel && (
              <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.5 }}>
                Te faltan {nextLevel.min - userXp} XP para subir de nivel
              </p>
            )}
          </div>
        </article>

        <article className="card" style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 24, borderRadius: 12
        }}>
          <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Acciones rapidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/retos" className="btn-secondary" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 8, textDecoration: 'none', color: '#fff' }}>🎯 Ver retos disponibles</Link>
            <Link to="/" className="btn-secondary" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 8, textDecoration: 'none', color: '#fff' }}>🔥 Ir al Fogon (Feed)</Link>
            <Link to="/bosque" className="btn-secondary" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 8, textDecoration: 'none', color: '#fff' }}>🌳 Ver tu bosque</Link>
          </div>
        </article>
      </section>

      <section className="card leaderboard-box" style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 24, borderRadius: 12
        }}>
        <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Top 5 en {profile.departamento || 'tu zona'}</h2>
        {leaderboard.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: 14 }}>Aun no hay campistas en tu zona</p>
        ) : (
          <ul className="leaderboard-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {leaderboard.map((entry, index) => (
              <li key={entry.uid} className="leaderboard-item" style={{
                display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <span className="rank" style={{ width: 30, fontWeight: 'bold', color: index < 3 ? '#fcd34d' : 'inherit', opacity: index < 3 ? 1 : 0.5 }}>#{index + 1}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {entry.avatarUrl ? <img src={entry.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 15 }}>{entry.displayName || `${entry.firstName} ${entry.lastName}`}</strong>
                    <small style={{ opacity: 0.6, fontSize: 12 }}>{entry.municipio}</small>
                  </div>
                </div>
                <div className="leaderboard-meta" style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: 12, opacity: 0.6 }}>{(entry.nivelActual || 'semilla').toUpperCase()}</span>
                  <strong style={{ color: 'var(--color-primary, #10b981)' }}>{entry.xpTotal || 0} XP</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
