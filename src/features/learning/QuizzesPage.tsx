import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { quizService, type QuizResult } from '../../services/quizService'
import { CARTILLAS_LINKS, getCartillaColor, getCartillaIcon, getCartillaName } from '../../config/cartillasLinks'
import '../../styles/pages.css'

const CARTILLA_KEYS = Object.keys(CARTILLAS_LINKS) as (keyof typeof CARTILLAS_LINKS)[]

export default function QuizzesPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    quizService.getUserQuizResults(user.uid).then((r) => {
      setResults(r)
      setLoading(false)
    })
  }, [user])

  // Build a map slug -> best result
  const bestByCartilla = results.reduce<Record<string, QuizResult>>((acc, r) => {
    if (!acc[r.cartillaId] || r.score > acc[r.cartillaId].score) acc[r.cartillaId] = r
    return acc
  }, {})

  const totalXP = results.reduce((sum, r) => sum + (r.xpGanado || 0), 0)
  const completadas = Object.values(bestByCartilla).filter(r => r.score >= 70).length

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando quizzes...</div>

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <h1>❓ Mis Quizzes</h1>
        <p className="page-subtitle">Evalúa tu conocimiento y gana XP por cada cartilla aprobada</p>
      </div>

      {/* Summary bar */}
      <div className="quiz-summary-bar">
        <div className="qs-item">
          <strong>{completadas}/{CARTILLA_KEYS.length}</strong>
          <span>Cartillas aprobadas</span>
        </div>
        <div className="qs-item">
          <strong>+{totalXP}</strong>
          <span>XP ganado en quizzes</span>
        </div>
        <div className="qs-item">
          <strong>{results.length}</strong>
          <span>Intentos totales</span>
        </div>
      </div>

      <div className="quizzes-grid">
        {CARTILLA_KEYS.map((slug) => {
          const color = getCartillaColor(slug)
          const icon = getCartillaIcon(slug)
          const name = getCartillaName(slug)
          const best = bestByCartilla[slug]
          const passed = best && best.score >= 70
          const numQuestions = quizService.getQuestionsByCartilla(slug).length

          return (
            <div key={slug} className="quiz-card" style={{ borderTop: `4px solid ${color}` }}>
              <div className="quiz-card-header">
                <span className="quiz-icon">{icon}</span>
                <div className="quiz-card-title">
                  <h3>{name}</h3>
                  <p>{numQuestions} preguntas · Mínimo 70% para aprobar</p>
                </div>
                {passed && <span className="quiz-passed-badge">✅</span>}
              </div>

              {best ? (
                <div className="quiz-prev-result">
                  <div className="prev-score" style={{ color: passed ? '#10b981' : '#f59e0b' }}>
                    Mejor resultado: <strong>{best.score}%</strong>
                  </div>
                  <div className="prev-xp">+{best.xpGanado} XP obtenidos</div>
                </div>
              ) : (
                <div className="quiz-no-result">
                  <span>Aún no has intentado este quiz</span>
                </div>
              )}

              <div className="quiz-card-footer">
                <Link
                  to={`/aprendizaje/cartillas/${slug}`}
                  className="btn-quiz"
                  style={{ background: color }}
                >
                  {best ? (passed ? '🔁 Repetir Quiz' : '🔄 Reintentar') : '▶ Comenzar'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent history */}
      {results.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Historial reciente</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {results.slice(0, 6).map((r) => (
              <div key={r.resultId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'white', borderRadius: 10, padding: '12px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              }}>
                <span style={{ fontSize: 20 }}>{getCartillaIcon(r.cartillaId)}</span>
                <span style={{ flex: 1, marginLeft: 12, fontWeight: 600 }}>{getCartillaName(r.cartillaId)}</span>
                <span style={{ color: r.score >= 70 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{r.score}%</span>
                <span style={{ marginLeft: 16, color: '#6b7280', fontSize: 13 }}>
                  {new Date(r.completadoAt).toLocaleDateString('es-CO')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
