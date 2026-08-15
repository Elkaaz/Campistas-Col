import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/pages.css'

interface Quiz {
  quizId: string
  titulo: string
  descripcion: string
  categoria: string
  preguntas: number
  duracionMinutos: number
  icono: string
  colorTema: string
  completado?: boolean
  puntuacion?: number
}

const QUIZZES_DEMO: Quiz[] = [
  {
    quizId: 'quiz-nudos',
    titulo: 'Nudos Básicos',
    descripcion: 'Pon a prueba tus conocimientos sobre nudos campamentiles esenciales',
    categoria: 'tecnicas',
    preguntas: 8,
    duracionMinutos: 10,
    icono: '🪢',
    colorTema: '#8B4513',
  },
  {
    quizId: 'quiz-primeros-auxilios',
    titulo: 'Primeros Auxilios',
    descripcion: 'Evaluación de conocimientos básicos en atención de emergencias',
    categoria: 'salud',
    preguntas: 10,
    duracionMinutos: 15,
    icono: '🚑',
    colorTema: '#DC143C',
  },
  {
    quizId: 'quiz-ambiental',
    titulo: 'Conciencia Ambiental',
    descripcion: 'Demuestra lo que sabes sobre cuidado del entorno en campamentos',
    categoria: 'ambiental',
    preguntas: 8,
    duracionMinutos: 10,
    icono: '🌱',
    colorTema: '#228B22',
  },
  {
    quizId: 'quiz-liderazgo',
    titulo: 'Liderazgo Juvenil',
    descripcion: 'Evalúa tus habilidades de liderazgo y trabajo en equipo',
    categoria: 'liderazgo',
    preguntas: 12,
    duracionMinutos: 20,
    icono: '👥',
    colorTema: '#4169E1',
  },
]

export default function QuizzesPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuizzes(QUIZZES_DEMO.map(q => ({ ...q, completado: false, puntuacion: undefined })))
    setLoading(false)
  }, [])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando quizzes...</div>

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <h1>❓ Quizzes</h1>
        <p className="page-subtitle">
          Pon a prueba tus conocimientos y gana XP adicional
        </p>
      </div>

      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.quizId} className="quiz-card" style={{ borderTop: `4px solid ${quiz.colorTema}` }}>
            <div className="quiz-header">
              <span className="quiz-icon">{quiz.icono}</span>
              <div>
                <h3>{quiz.titulo}</h3>
                <p>{quiz.descripcion}</p>
              </div>
            </div>

            <div className="quiz-stats">
              <span>📝 {quiz.preguntas} preguntas</span>
              <span>⏱️ {quiz.duracionMinutos} min</span>
            </div>

            <div className="quiz-footer">
              {quiz.completado ? (
                <div className="quiz-completed">
                  <span className="quiz-score">⭐ {quiz.puntuacion}/100</span>
                  <span className="quiz-status">Completado</span>
                </div>
              ) : (
                <button className="btn-quiz" style={{ background: quiz.colorTema }}>
                  Comenzar Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
