import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { postsService, profileService } from '../../services'
import { Post, User } from '../../types'
import '../../styles/pages.css'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [pendingPosts, setPendingPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validando, setValidando] = useState<Record<string, boolean>>({})
  const [comentarios, setComentarios] = useState<Record<string, string>>({})
  const [xpAmounts, setXpAmounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setLoading(true)
    let unsubscribe: () => void = () => {}

    try {
      // Subscribe to pending posts in real-time
      unsubscribe = postsService.subscribePendingPosts((data) => {
        setPendingPosts(data)
        setLoading(false)
      }) as () => void
    } catch (err) {
      console.error('Error setting up admin listener:', err)
      setError('Error cargando validaciones pendientes')
      setLoading(false)
    }

    return () => unsubscribe()
  }, [])

  async function handleValidar(postId: string, approved: boolean, xpAmount: number = 80) {
    if (!user?.uid) return

    setValidando((prev) => ({ ...prev, [postId]: true }))
    setError(null)

    try {
      const post = pendingPosts.find((p) => p.postId === postId)
      if (!post) throw new Error('Post no encontrado')

      // Validate/reject post
      if (approved) {
        await postsService.validatePost(
          postId,
          user.uid,
          user.displayName || 'Admin',
          xpAmount,
          comentarios[postId] || 'Reto validado exitosamente'
        )

        // Add XP to user
        await profileService.addXp(post.uid, xpAmount)
      } else {
        await postsService.rejectPost(
          postId,
          user.uid,
          user.displayName || 'Admin',
          comentarios[postId] || 'Reto rechazado'
        )
      }

      // Clear form
      setComentarios((prev) => {
        const newComments = { ...prev }
        delete newComments[postId]
        return newComments
      })
      setXpAmounts((prev) => {
        const newXp = { ...prev }
        delete newXp[postId]
        return newXp
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error validando reto')
    } finally {
      setValidando((prev) => ({ ...prev, [postId]: false }))
    }
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Admin</span>
          <h1>Panel de Validación de Retos</h1>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '20px' }}>{error}</div>}

      <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <article className="card">
          <h2>🔍 Retos Pendientes de Validación ({pendingPosts.length})</h2>
          {loading ? (
            <p style={{ color: '#6b7280' }}>Cargando...</p>
          ) : pendingPosts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              <p>✓ No hay retos pendientes. ¡Todos validados!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
              {pendingPosts.map((post) => (
                <div
                  key={post.postId}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#f9fafb',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem' }}>📌 {post.titulo}</strong>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                          Reto: <strong>{post.retoTitulo || post.retoTipo}</strong>
                        </div>
                      </div>
                      <span style={{ background: '#fcd34d', color: '#78350f', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                        Pendiente
                      </span>
                    </div>

                    <p style={{ color: '#6b7280', margin: '8px 0 0', fontSize: '0.9rem' }}>
                      👤 Campista: <strong>{post.autoresNombre}</strong>
                    </p>
                    <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem' }}>
                      📍 {post.municipio}, {post.departamento}
                    </p>
                    <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                      {post.descripcion}
                    </p>

                    {post.imagenes && post.imagenes.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <small style={{ color: '#6b7280' }}>📸 {post.imagenes.length} archivo(s)</small>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                      XP a asignar (default 80)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={xpAmounts[post.postId] || 80}
                      onChange={(e) =>
                        setXpAmounts((prev) => ({ ...prev, [post.postId]: parseInt(e.target.value) || 80 }))
                      }
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <label style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Comentario (opcional)</span>
                    <textarea
                      value={comentarios[post.postId] || ''}
                      onChange={(e) =>
                        setComentarios((prev) => ({ ...prev, [post.postId]: e.target.value }))
                      }
                      placeholder="Feedback para el campista"
                      rows={2}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                      }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleValidar(post.postId, true, xpAmounts[post.postId] || 80)}
                      disabled={validando[post.postId]}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: '#10b981',
                        color: 'white',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {validando[post.postId] ? '⏳ Procesando...' : '✓ Aprobar + Asignar XP'}
                    </button>
                    <button
                      onClick={() => handleValidar(post.postId, false)}
                      disabled={validando[post.postId]}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: '#ef4444',
                        color: 'white',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {validando[post.postId] ? '⏳ Procesando...' : '✗ Rechazar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
