import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCampistasByDepartamento } from '../../services/campistaProfileService'
import NivelBadge from '../../components/cards/NivelBadge'
import type { CampistaProfile } from '../../types'
import '../../styles/pages.css'

const NIVEL_EMOJIS: Record<string, string> = {
  semilla: '🌱', raiz: '🌿', tallo: '🪵', hoja: '🍃', flor: '🌸', fruto: '🌳', honorario: '⭐'
}

export default function BosqueLocalPage() {
  const { user, profile: myProfile, loading: authLoading } = useAuth()
  const [campistas, setCampistas] = useState<CampistaProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || !myProfile) { setLoading(false); return }

    const cargar = async () => {
      try {
        const data = await getCampistasByDepartamento(myProfile.departamento)
        // Excluir al usuario actual
        setCampistas(data.filter(c => c.uid !== user.uid))
      } catch (err) {
        console.error('[BosqueLocalPage]', err)
        setCampistas([])
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user, myProfile, authLoading])

  const departamento = myProfile?.departamento || ''
  const municipio = myProfile?.municipio || ''

  return (
    <div className="page-shell">
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 60%, #10b981 100%)',
        borderRadius: 16, padding: '28px 24px', marginBottom: 24,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🌳</div>
        <h1 style={{ margin: '0 0 6px', color: '#fff', fontSize: 26 }}>Mi Bosque</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Campistas de {municipio ? `${municipio}, ` : ''}{departamento || 'tu region'}
        </p>
      </div>

      {/* CONTENIDO */}
      {!user ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <h3>Inicia sesion para ver tu bosque</h3>
          <p style={{ opacity: 0.6, marginBottom: 20 }}>Conectate con campistas de tu departamento</p>
          <Link to="/auth" className="btn-primary">Iniciar sesion</Link>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: 40, opacity: 0.6 }}>
          <p>Cargando campistas de tu region...</p>
        </div>
      ) : campistas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <h3>Tu bosque esta creciendo</h3>
          <p style={{ opacity: 0.6 }}>
            Aun no hay otros campistas registrados en {departamento || 'tu departamento'}.
          </p>
          <p style={{ opacity: 0.4, fontSize: 13 }}>Invita a tus compañeros al campamento!</p>
        </div>
      ) : (
        <>
          <p style={{ opacity: 0.5, fontSize: 13, marginBottom: 16 }}>
            {campistas.length} campista{campistas.length !== 1 ? 's' : ''} en tu departamento
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {campistas.map(c => {
              const nombre = c.displayName || `${c.firstName} ${c.lastName}`.trim()
              const nivel = c.nivelActual || 'semilla'
              return (
                <Link
                  key={c.uid}
                  to={`/perfiles/${c.uid}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--color-surface, rgba(255,255,255,0.05))',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '16px 12px',
                    textAlign: 'center',
                    transition: 'transform 0.2s, border-color 0.2s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, margin: '0 auto 10px',
                      overflow: 'hidden',
                    }}>
                      {c.avatarUrl
                        ? <img src={c.avatarUrl} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>{NIVEL_EMOJIS[nivel] || '🏕️'}</span>
                      }
                    </div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>{nombre}</p>
                    <p style={{ margin: '0 0 8px', opacity: 0.5, fontSize: 12 }}>
                      📍 {c.municipio || 'Sin municipio'}
                    </p>
                    <NivelBadge nivel={nivel} size="sm" />
                    <p style={{ margin: '8px 0 0', opacity: 0.5, fontSize: 12 }}>
                      ⚡ {c.xpTotal?.toLocaleString() || '0'} XP
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
