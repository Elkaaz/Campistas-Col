import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCampistasByDepartamento } from '../../services/campistaProfileService'
import { postsService } from '../../services/postsService'
import { servicioService } from '../../services/servicioService'
import { notificationsService } from '../../services/notificationsService'
import { CARTILLAS_LINKS } from '../../config/cartillasLinks'
import { ROLE_COLORS, ROLE_EMOJIS, ROLE_LABELS } from '../../lib/constants'
import RoleBadge from '../../components/common/RoleBadge'
import type { CampistaProfile, Post, Servicio } from '../../types'
import '../../styles/pages.css'

function getLevelFromXp(xpTotal: number): string {
  if (xpTotal >= 15000) return 'Fruto'
  if (xpTotal >= 7500) return 'Flor'
  if (xpTotal >= 3500) return 'Hoja'
  if (xpTotal >= 1500) return 'Tallo'
  if (xpTotal >= 500) return 'Raíz'
  return 'Semilla'
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [rankingLocal, setRankingLocal] = useState<CampistaProfile[]>([])
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [myServicios, setMyServicios] = useState<Servicio[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || !profile) { setLoading(false); return }

    const cargar = async () => {
      try {
        const [campistasData, posts, servicios, notifs] = await Promise.all([
          getCampistasByDepartamento(profile.departamento),
          postsService.getFeedSocial(100),
          servicioService.getServiciosByUser(user.uid),
          notificationsService.getUnreadNotifications(user.uid),
        ])
        
        const sorted = campistasData.sort((a, b) => (b.xpTotal || 0) - (a.xpTotal || 0)).slice(0, 5)
        setRankingLocal(sorted)
        
        const myPostsList = posts.filter(p => p.uid === user.uid).slice(0, 5)
        setMyPosts(myPostsList)
        
        setMyServicios(servicios.slice(0, 5))
        setUnreadNotifications(notifs.length)
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
  const nivelActual = getLevelFromXp(userXp)
  const validatedPosts = myPosts.filter(p => p.estado === 'validado').length
  const validatedServicios = myServicios.filter(s => s.estado === 'validado').length
  const totalHoras = myServicios
    .filter(s => s.estado === 'validado')
    .reduce((sum, s) => sum + s.horas, 0)

  const xpCategories = [
    { label: 'Retos', value: validatedPosts * 80, color: '#FF6F00', icon: '⛰️' },
    { label: 'Cartillas', value: profile.cartillasCompletadas * 50, color: '#2E7D32', icon: '📚' },
    { label: 'Quizzes', value: profile.quizzesCompletados * 30, color: '#4169E1', icon: '❓' },
    { label: 'Servicio', value: totalHoras * 10, color: '#DC143C', icon: '⏱️' },
  ]
  const maxXp = Math.max(...xpCategories.map(c => c.value), 1)

  const stats = [
    { label: 'XP Total', value: String(userXp.toLocaleString()), icon: '⚡' },
    { label: 'Nivel', value: nivelActual, icon: '🎖️' },
    { label: 'Retos', value: String(validatedPosts), icon: '⛰️' },
    { label: 'Servicio', value: `${totalHoras}h`, icon: '⏱️' },
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

      {/* ── STATS RÁPIDOS ── */}
      <section className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {stats.map((item) => (
          <article className="card stat-card" key={item.label} style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 16,
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
            <p style={{ margin: '0 0 6px', fontSize: 12, opacity: 0.6 }}>{item.label}</p>
            <strong style={{ fontSize: 22 }}>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24,
        marginBottom: 24
      }}>
        {/* ── GRÁFICO XP POR CATEGORÍA ── */}
        <article className="card" style={{
          background: 'var(--color-surface, rgba(255,255,255,0.05))',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 24,
          borderRadius: 12
        }}>
          <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>XP por Categoría</h2>
          <div className="xp-bars">
            {xpCategories.map((cat) => {
              const percent = Math.round((cat.value / maxXp) * 100)
              return (
                <div key={cat.label} className="xp-bar-item">
                  <div className="xp-bar-label">
                    <span>{cat.icon} {cat.label}</span>
                    <span>{cat.value} XP</span>
                  </div>
                  <div className="xp-bar-track">
                    <div
                      className="xp-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        {/* ── ACCIONES RÁPIDAS ── */}
        <article className="card" style={{
          background: 'var(--color-surface, rgba(255,255,255,0.05))',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 24,
          borderRadius: 12
        }}>
          <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Acciones rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/retos" className="btn-quick-action" style={{ textDecoration: 'none', color: '#fff' }}>🎯 Ver retos disponibles</Link>
            <Link to="/fogon" className="btn-quick-action" style={{ textDecoration: 'none', color: '#fff' }}>🔥 Ir a la Zona de Fogata</Link>
            <Link to="/servicio" className="btn-quick-action" style={{ textDecoration: 'none', color: '#fff' }}>⏱️ Registrar horas</Link>
            {unreadNotifications > 0 && (
              <Link to="/notificaciones" className="btn-quick-action" style={{ textDecoration: 'none', color: '#fff', background: '#F44336' }}>
                🔔 {unreadNotifications} notificaciones
              </Link>
            )}
          </div>
        </article>
      </section>

      {/* ── INSIGNIAS ── */}
      <section className="card" style={{
        background: 'var(--color-surface, rgba(255,255,255,0.05))',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 24,
        borderRadius: 12,
        marginBottom: 24
      }}>
        <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>🏅 Insignias</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries(CARTILLAS_LINKS).map(([slug, meta]: [string, any]) => {
            const isUnlocked = ['tecnicas-campamentiles', 'prevencion-salud'].includes(slug)
            return (
              <div key={slug} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                background: isUnlocked ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)',
                border: `1.5px solid ${isUnlocked ? meta.colorTema : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                minWidth: 100,
                opacity: isUnlocked ? 1 : 0.6,
              }}>
                <span style={{ fontSize: 28 }}>{meta.icono}</span>
                <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', color: isUnlocked ? '#fff' : '#9ca3af' }}>
                  {meta.nombre.split(' ').slice(0, 2).join(' ')}
                </span>
                {isUnlocked && (
                  <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>✓ Desbloqueada</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ACTIVIDAD RECIENTE ── */}
      <section className="card" style={{
        background: 'var(--color-surface, rgba(255,255,255,0.05))',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 24,
        borderRadius: 12,
        marginBottom: 24
      }}>
        <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Actividad Reciente</h2>
        {myPosts.length === 0 && myServicios.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: 14 }}>Aún no tienes actividad. ¡Comienza completando retos!</p>
        ) : (
          <ul className="activity-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {myPosts.slice(0, 3).map((post) => (
              <li key={post.postId} className="activity-item">
                <span className="activity-icon">⛰️</span>
                <div className="activity-content">
                  <strong>Completaste {post.retoTitulo}</strong>
                  <p>+{post.xpAsignado} XP · {new Date(post.createdAt).toLocaleDateString('es-CO')}</p>
                </div>
              </li>
            ))}
            {myServicios.slice(0, 2).map((servicio) => (
              <li key={servicio.servicioId} className="activity-item">
                <span className="activity-icon">⏱️</span>
                <div className="activity-content">
                  <strong>{servicio.titulo}</strong>
                  <p>{servicio.horas}h · {new Date(servicio.createdAt).toLocaleDateString('es-CO')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── LEADERBOARD LOCAL ── */}
      <section className="card leaderboard-box" style={{
        background: 'var(--color-surface, rgba(255,255,255,0.05))',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 24,
        borderRadius: 12
      }}>
        <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Top 5 en {profile.departamento || 'tu zona'}</h2>
        {rankingLocal.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: 14 }}>Aun no hay campistas en tu zona</p>
        ) : (
          <ul className="leaderboard-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rankingLocal.map((entry, index) => (
              <li key={entry.uid} className="leaderboard-item" style={{
                display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < rankingLocal.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
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
                  <RoleBadge role={entry.role} size="sm" />
                  <span style={{ display: 'block', fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                    {ROLE_EMOJIS[entry.role] || '🎖️'} {(entry.nivelActual || 'semilla').toUpperCase()}
                  </span>
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
