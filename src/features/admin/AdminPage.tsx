import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { getPublicacionesPendientes, validarSolucionReto } from '../../services/retosService'
import type { PublicacionReto } from '../../services/retosService'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [publicacionesPendientes, setPublicacionesPendientes] = useState<PublicacionReto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validando, setValidando] = useState<Record<string, boolean>>({})
  const [comentarios, setComentarios] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function loadPendientes() {
      setLoading(true)
      try {
        const data = await getPublicacionesPendientes()
        setPublicacionesPendientes(data)
      } catch (err) {
        setError('Error cargando validaciones pendientes')
      } finally {
        setLoading(false)
      }
    }

    loadPendientes()
  }, [])

  async function handleValidar(publicacionId: string, retoId: string, approved: boolean) {
    if (!user?.uid) return

    setValidando((prev) => ({ ...prev, [publicacionId]: true }))
    setError(null)

    try {
      await validarSolucionReto(
        retoId,
        publicacionId,
        user.uid,
        approved,
        comentarios[publicacionId] || '',
      )

      setPublicacionesPendientes((prev) =>
        prev.filter((p) => p.id !== publicacionId),
      )
      setComentarios((prev) => {
        const newComments = { ...prev }
        delete newComments[publicacionId]
        return newComments
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error validando reto')
    } finally {
      setValidando((prev) => ({ ...prev, [publicacionId]: false }))
    }
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Admin</span>
          <h1>Panel de administración</h1>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '20px' }}>{error}</div>}

      <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <article className="card">
          <h2>Validaciones pendientes</h2>
          {loading ? (
            <p style={{ color: '#6b7280' }}>Cargando...</p>
          ) : publicacionesPendientes.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay validaciones pendientes</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
              {publicacionesPendientes.map((pub) => (
                <div
                  key={pub.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.05rem' }}>Reto: {pub.retoId}</strong>
                      <span className="status-tag">Pendiente</span>
                    </div>
                    <p style={{ color: '#6b7280', margin: '8px 0 0', fontSize: '0.9rem' }}>
                      Campista: <strong>{pub.uid}</strong>
                    </p>
                    <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '0.9rem' }}>
                      Evidencia: <strong>{pub.evidencia}</strong>
                    </p>
                  </div>

                  <label style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Comentario (opcional)</span>
                    <textarea
                      value={comentarios[pub.id] || ''}
                      onChange={(e) =>
                        setComentarios((prev) => ({ ...prev, [pub.id]: e.target.value }))
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
                      onClick={() => handleValidar(pub.id, pub.retoId, true)}
                      disabled={validando[pub.id]}
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
                      {validando[pub.id] ? '...' : '✓ Aprobar'}
                    </button>
                    <button
                      onClick={() => handleValidar(pub.id, pub.retoId, false)}
                      disabled={validando[pub.id]}
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
                      {validando[pub.id] ? '...' : '✗ Rechazar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="content-grid" style={{ marginTop: '24px' }}>
        <article className="card">
          <h2>Roles disponibles</h2>
          <ul className="list">
            <li className="list-item">
              <div>
                <strong>Campista</strong>
                <small>Participante base del campamento</small>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Líder de bosque</strong>
                <small>Puede validar retos de su grupo</small>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Comité departamental</strong>
                <small>Validación a nivel departamental</small>
              </div>
            </li>
            <li className="list-item">
              <div>
                <strong>Admin</strong>
                <small>Control total del campamento</small>
              </div>
            </li>
          </ul>
        </article>

        <article className="card">
          <h2>Estadísticas</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ color: '#6b7280' }}>Campistas activos</span>
              <strong>--</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ color: '#6b7280' }}>Retos completados</span>
              <strong>{publicacionesPendientes.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ color: '#6b7280' }}>Nivel promedio</span>
              <strong>--</strong>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
