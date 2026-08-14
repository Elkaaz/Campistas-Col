import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { getRetos, publicarSolucionReto } from '../../services/retosService'
import type { Reto } from '../../services/retosService'

export default function ChallengePage() {
  const [user, setUser] = useState<any>(null)
  const [retos, setRetos] = useState<Reto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReto, setSelectedReto] = useState<string | null>(null)
  const [evidencia, setEvidencia] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function loadRetos() {
      setLoading(true)
      try {
        const data = await getRetos()
        setRetos(data)
      } catch (err) {
        setError('Error cargando retos')
      } finally {
        setLoading(false)
      }
    }

    loadRetos()
  }, [])

  async function handlePublicar(retoId: string) {
    if (!user?.uid || !evidencia.trim()) {
      setError('Debes estar autenticado y proporcionar evidencia')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await publicarSolucionReto(retoId, user.uid, evidencia)
      setEvidencia('')
      setSelectedReto(null)
      alert('✓ Solución publicada. Pendiente de validación')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar solución')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Retos</span>
          <h1>Retos campamentiles</h1>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Cargando retos...</p>
        </div>
      ) : retos.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p>No hay retos disponibles en este momento</p>
        </div>
      ) : (
        <div className="content-grid">
          {retos.map((reto) => (
            <article className="card" key={reto.id}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ marginBottom: '8px' }}>{reto.titulo}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 12px' }}>
                  {reto.descripcion}
                </p>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span className="status-tag" style={{ background: '#fef3c7', color: '#92400e' }}>
                    +{reto.xpRecompensa} XP
                  </span>
                  <span className="status-tag" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                    {reto.dificultad}
                  </span>
                  {reto.requiereValidacion && (
                    <span className="status-tag" style={{ background: '#fce7f3', color: '#831843' }}>
                      Requiere validación
                    </span>
                  )}
                </div>
              </div>

              {selectedReto === reto.id ? (
                <div style={{ display: 'grid', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <label>
                    Evidencia (URL, descripción, etc.)
                    <textarea
                      value={evidencia}
                      onChange={(e) => setEvidencia(e.target.value)}
                      placeholder="Describe cómo completaste el reto o proporciona un enlace a la evidencia"
                      rows={4}
                      style={{ borderColor: '#d1d5db' }}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="primary-button"
                      onClick={() => handlePublicar(reto.id)}
                      disabled={submitting || !evidencia.trim()}
                      style={{ flex: 1 }}
                    >
                      {submitting ? 'Publicando...' : 'Publicar'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReto(null)
                        setEvidencia('')
                      }}
                      style={{
                        border: '1px solid #d1d5db',
                        background: 'white',
                        color: '#374151',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="primary-button"
                  onClick={() => setSelectedReto(reto.id)}
                  style={{ width: '100%' }}
                >
                  Publicar reto
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

