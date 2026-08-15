import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import type { CampistaProfile } from '../../types'
import NivelBadge from '../../components/cards/NivelBadge'
import '../../styles/pages.css'

const NIVEL_EMOJIS: Record<string, string> = {
  semilla: '🌱', raiz: '🌿', tallo: '🪵', hoja: '🍃', flor: '🌸', fruto: '🌳', honorario: '⭐'
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<CampistaProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id || !db) { setNotFound(true); setLoading(false); return }

    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db!, 'profiles', id))
        if (snap.exists()) {
          setProfile(snap.data() as CampistaProfile)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('[PublicProfilePage]', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [id])

  if (loading) {
    return (
      <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <p style={{ opacity: 0.6 }}>Cargando perfil...</p>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="page-shell" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>👤</div>
        <h2>Campista no encontrado</h2>
        <p style={{ opacity: 0.6, marginBottom: 24 }}>Este perfil no existe o fue eliminado</p>
        <Link to="/" className="btn-primary">Volver al fogon</Link>
      </div>
    )
  }

  const nivel = profile.nivelActual || 'semilla'
  const nombreCompleto = profile.displayName || `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <div className="page-shell">
      {/* ── HERO PERFIL ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary, #6366f1) 100%)',
        borderRadius: 16,
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        {/* Avatar */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, margin: '0 auto 16px',
          border: '3px solid rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}>
          {profile.avatarUrl
            ? <img src={profile.avatarUrl} alt={nombreCompleto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span>{NIVEL_EMOJIS[nivel] || '🏕️'}</span>
          }
        </div>

        <h1 style={{ margin: '0 0 4px', fontSize: 26, color: '#fff' }}>{nombreCompleto}</h1>
        <p style={{ margin: '0 0 16px', opacity: 0.8, fontSize: 14, color: '#fff' }}>
          📍 {profile.municipio}{profile.departamento ? `, ${profile.departamento}` : ''}
        </p>

        {/* Nivel badge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NivelBadge nivel={nivel} size="md" />
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {[
          { label: 'XP Total', value: profile.xpTotal?.toLocaleString() || '0', icon: '⚡' },
          { label: 'Nivel', value: nivel.charAt(0).toUpperCase() + nivel.slice(1), icon: NIVEL_EMOJIS[nivel] || '🏕️' },
          { label: 'Rol', value: profile.role === 'campista' ? 'Campista' : profile.role === 'lider_bosque' ? 'Lider' : profile.role, icon: '🎖️' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--color-surface, rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{stat.value}</div>
            <div style={{ opacity: 0.5, fontSize: 12 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── BIO ── */}
      {profile.bio && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, opacity: 0.7 }}>Sobre mi</h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{profile.bio}</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/" style={{ opacity: 0.5, fontSize: 13 }}>← Volver al Fogon</Link>
      </div>
    </div>
  )
}
