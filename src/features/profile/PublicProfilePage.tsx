import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../hooks/useAuth'
import { postsService } from '../../services/postsService'
import { servicioService } from '../../services/servicioService'
import { CARTILLAS_LINKS } from '../../config/cartillasLinks'
import { ROLE_COLORS, ROLE_EMOJIS, ROLE_LABELS, NIVEL_EMOJIS } from '../../lib/constants'
import RoleBadge from '../../components/common/RoleBadge'
import type { CampistaProfile, Post, Servicio } from '../../types'

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [profile, setProfile] = useState<CampistaProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('info')
  const [posts, setPosts] = useState<Post[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loadingTab, setLoadingTab] = useState(false)

  useEffect(() => {
    if (!id || !db) { setNotFound(true); setLoading(false); return }

    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db!, 'profiles', id))
        if (snap.exists()) {
          setProfile(snap.data() as CampistaProfile)
          if (user) {
            const following = await followService.isFollowing(user.uid, id)
            setIsFollowing(following)
          }
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
  }, [id, user])

  useEffect(() => {
    if (!id || !profile) return
    let cancelled = false

    const cargarTab = async () => {
      setLoadingTab(true)
      try {
        if (activeTab === 'retos' || activeTab === 'actividad') {
          const feed = await postsService.getFeedSocial(200)
          const userPosts = feed.filter(p => p.uid === id).slice(0, 20)
          if (!cancelled) setPosts(userPosts)
        }
        if (activeTab === 'cartillas' || activeTab === 'actividad') {
          const userServicios = await servicioService.getServiciosByUser(id)
          if (!cancelled) setServicios(userServicios.slice(0, 20))
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLoadingTab(false)
      }
    }

    cargarTab()
    return () => { cancelled = true }
  }, [id, profile, activeTab])

  const handleFollowToggle = async () => {
    if (!user || !id || !profile) return
    try {
      setFollowLoading(true)
      if (isFollowing) {
        await followService.unfollow(user.uid, id)
        setIsFollowing(false)
        setProfile({ ...profile, seguidores: (profile.seguidores || 0) - 1 })
      } else {
        await followService.follow(user.uid, id)
        setIsFollowing(true)
        setProfile({ ...profile, seguidores: (profile.seguidores || 0) + 1 })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setFollowLoading(false)
    }
  }

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
        <Link to="/" className="btn-primary">Volver a la Zona de Fogata</Link>
      </div>
    )
  }

  const nivel = profile.nivelActual || 'semilla'
  const nombreCompleto = profile.displayName || `${profile.firstName} ${profile.lastName}`.trim()
  const isOwnProfile = user?.uid === id
  const validatedPosts = posts.filter(p => p.estado === 'validado')

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'info', label: 'Info', icon: '👤' },
    { id: 'actividad', label: 'Actividad', icon: '⚡' },
    { id: 'retos', label: 'Retos', icon: '⛰️' },
    { id: 'cartillas', label: 'Formación', icon: '📚' },
  ]

  return (
    <div className="page-shell">
      {/* ── HERO PERFIL ── */}
      <div style={{
        background: `linear-gradient(135deg, ${ROLE_COLORS[profile.role] || '#10b981'} 0%, ${ROLE_COLORS[profile.role] || '#10b981'}cc 100%)`,
        borderRadius: 16,
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 24,
        position: 'relative',
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

        {/* Nivel + Rol + Insignias */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: 12,
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
          }}>
            {NIVEL_EMOJIS[nivel] || '🏕️'} {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
          </span>
          <RoleBadge role={profile.role} size="md" />
        </div>

        {/* Seguidores / Siguiendo */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
          <span><strong>{profile.seguidores || 0}</strong> seguidores</span>
          <span><strong>{profile.siguiendo || 0}</strong> siguiendo</span>
        </div>

        {/* Botón seguir */}
        {!isOwnProfile && user && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: '2px solid white',
              background: isFollowing ? 'transparent' : 'white',
              color: isFollowing ? 'white' : '#2E7D32',
              fontWeight: 700,
              fontSize: 13,
              cursor: followLoading ? 'not-allowed' : 'pointer',
              opacity: followLoading ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isFollowing ? '✓ Siguiendo' : '+ Seguir'}
          </button>
        )}
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        borderBottom: '2px solid rgba(255,255,255,0.08)',
        paddingBottom: 8,
        overflowX: 'auto',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-primary, #10b981)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text, #e2e8f0)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO TAB ── */}
      {loadingTab ? (
        <div style={{ padding: 40, textAlign: 'center', opacity: 0.6 }}>Cargando...</div>
      ) : (
        <div>
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile.bio && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.7 }}>Sobre mi</h3>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{profile.bio}</p>
                </div>
              )}
              {(profile as any).nombreBosque && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.7 }}>🌳 Bosque / Grupo</h3>
                  <p style={{ margin: 0, fontWeight: 700 }}>{(profile as any).nombreBosque}</p>
                </div>
              )}
              {(profile as any).habilidadEspecial && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.7 }}>⭐ Habilidad especial</h3>
                  <p style={{ margin: 0, fontWeight: 700, textTransform: 'capitalize' }}>{(profile as any).habilidadEspecial.replace('_', ' ')}</p>
                </div>
              )}
              {(profile as any).redesSociales && Object.keys((profile as any).redesSociales).length > 0 && (
                <div className="card" style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.7 }}>🌐 Redes sociales</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Object.entries((profile as any).redesSociales).map(([red, handle]: [string, string]) => (
                      <span key={red} style={{ fontSize: 13 }}>
                        <strong>{red}:</strong> {handle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.7 }}>📊 Datos generales</h3>
                <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
                  <span><strong>Departamento:</strong> {profile.departamento || '—'}</span>
                  <span><strong>Municipio:</strong> {profile.municipio || '—'}</span>
                  {(profile as any).tipoDocumento && <span><strong>Documento:</strong> {(profile as any).tipoDocumento} {(profile as any).documento}</span>}
                  <span><strong>Rol:</strong> {ROL_LABELS[profile.role] || profile.role}</span>
                  <span><strong>Nivel:</strong> {nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.length === 0 && servicios.length === 0 ? (
                <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ opacity: 0.5 }}>Aún no hay actividad pública</p>
                </div>
              ) : (
                <>
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.postId} className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 24 }}>⛰️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <strong>Reto: {post.retoTitulo}</strong>
                          {(post as any).autorRole && <RoleBadge role={(post as any).autorRole} size="sm" />}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.6 }}>
                          +{post.xpAsignado} XP · {new Date(post.createdAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {servicios.slice(0, 5).map((servicio) => (
                    <div key={servicio.servicioId} className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 24 }}>⏱️</span>
                      <div>
                        <strong>{servicio.titulo}</strong>
                        <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.6 }}>
                          {servicio.horas}h · {new Date(servicio.createdAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'retos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.length === 0 ? (
                <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ opacity: 0.5 }}>Aún no ha publicado retos</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.postId} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong>{post.retoTitulo}</strong>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {(post as any).autorRole && <RoleBadge role={(post as any).autorRole} size="sm" />}
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                          background: post.estado === 'validado' ? '#10b981' : '#f59e0b',
                          color: 'white',
                        }}>
                          {post.estado === 'validado' ? '✓ Validado' : '⏳ Pendiente'}
                        </span>
                      </div>
                    </div>
                    {post.estado === 'validado' && (
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                        ✅ Verificado por Líder
                      </p>
                    )}
                    <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.7 }}>{post.contenido.slice(0, 180)}...</p>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>
                      {new Date(post.createdAt).toLocaleDateString('es-CO')} · {post.xpAsignado} XP
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cartillas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(CARTILLAS_LINKS).map(([slug, meta]: [string, any]) => {
                const isUnlocked = ['tecnicas-campamentiles', 'prevencion-salud'].includes(slug)
                return (
                  <div key={slug} className="card" style={{
                    padding: 16,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    opacity: isUnlocked ? 1 : 0.6,
                    borderLeft: `4px solid ${meta.colorTema}`,
                  }}>
                    <span style={{ fontSize: 36 }}>{meta.icono}</span>
                    <div style={{ flex: 1 }}>
                      <strong>{meta.nombre}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.7 }}>
                        {isUnlocked ? '✅ Completada' : '📖 Pendiente'} · +{meta.xpAlCompletar ?? 0} XP
                      </p>
                    </div>
                    {isUnlocked && (
                      <span style={{ fontSize: 20 }}>🏅</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/" style={{ opacity: 0.5, fontSize: 13 }}>← Volver a la Zona de Fogata</Link>
      </div>
    </div>
  )
}
