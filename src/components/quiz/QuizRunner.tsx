import { useState, useEffect, useRef } from 'react'
import type { QuizQuestion } from '../../types'
import { quizService } from '../../services/quizService'
import { profileService } from '../../services'
import { useAuth } from '../../hooks/useAuth'
import './QuizRunner.css'

type QuizRunnerProps = {
  cartillaId: string
  cartillaName: string
  cartillaColor: string
  xpBase: number
  insignia?: string
  onComplete: (score: number, xpGanado: number, badge?: string) => void
  onCancel: () => void
}

type Phase = 'intro' | 'question' | 'answer-reveal' | 'results'

export default function QuizRunner({
  cartillaId,
  cartillaName,
  cartillaColor,
  xpBase,
  insignia,
  onComplete,
  onCancel,
}: QuizRunnerProps) {
  const { user, reloadProfile } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const qs = quizService.getQuestionsByCartilla(cartillaId)
    setQuestions(qs)
    setAnswers(new Array(qs.length).fill(null))
  }, [cartillaId])

  // Timer starts on first question
  useEffect(() => {
    if (phase === 'question') {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else if (phase === 'results') {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const currentQ = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1

  // Derived results
  const calcScore = () => {
    if (!questions.length) return { score: 0, correctas: 0, totalPoints: 0, earnedPoints: 0 }
    let earned = 0, total = 0, correctas = 0
    questions.forEach((q, i) => {
      total += q.puntos
      if (answers[i] === q.respuestaCorrecta) {
        earned += q.puntos
        correctas++
      }
    })
    return {
      score: Math.round((earned / total) * 100),
      correctas,
      totalPoints: total,
      earnedPoints: earned,
    }
  }

  const handleSelect = (idx: number) => {
    if (phase !== 'question') return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    const newAnswers = [...answers]
    newAnswers[currentIdx] = selected
    setAnswers(newAnswers)
    setPhase('answer-reveal')
  }

  const handleNext = () => {
    setSelected(null)
    if (isLast) {
      setPhase('results')
    } else {
      setCurrentIdx((i) => i + 1)
      setPhase('question')
    }
  }

  const handleFinish = async () => {
    if (!user) return
    setSaving(true)
    const { score, correctas, earnedPoints } = calcScore()
    const xpGanado = quizService.calcularXP(score, xpBase)
    const badge = score >= 70 ? insignia : undefined
    try {
      await quizService.saveQuizResult(
        user.uid,
        cartillaId,
        score,
        correctas,
        questions.length,
        xpGanado,
        elapsed,
        badge
      )
      if (xpGanado > 0) {
        await profileService.addXp(user.uid, xpGanado)
        await reloadProfile()
      }
    } catch (e) {
      console.error('Error saving quiz result', e)
    } finally {
      setSaving(false)
      onComplete(score, xpGanado, badge)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <div className="qr-overlay">
        <div className="qr-card qr-intro" style={{ '--accent': cartillaColor } as any}>
          <div className="qr-intro-icon">{cartillaId === 'prevencion-salud' ? '🏥' : '📝'}</div>
          <h2>Quiz: {cartillaName}</h2>
          <p className="qr-intro-sub">Demuestra lo que aprendiste en esta cartilla</p>
          <div className="qr-intro-stats">
            <div className="qr-stat"><strong>{questions.length}</strong><span>Preguntas</span></div>
            <div className="qr-stat"><strong>{xpBase} XP</strong><span>Máximo</span></div>
            <div className="qr-stat"><strong>70%</strong><span>Para aprobar</span></div>
          </div>
          {insignia && (
            <div className="qr-badge-preview">
              🏅 Si apruebas ganas la insignia: <strong>{insignia}</strong>
            </div>
          )}
          <div className="qr-actions">
            <button className="qr-btn-primary" style={{ background: cartillaColor }} onClick={() => setPhase('question')}>
              ¡Comenzar!
            </button>
            <button className="qr-btn-ghost" onClick={onCancel}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── RESULTS ── */
  if (phase === 'results') {
    const { score, correctas } = calcScore()
    const xpGanado = quizService.calcularXP(score, xpBase)
    const passed = score >= 70
    return (
      <div className="qr-overlay">
        <div className="qr-card qr-results" style={{ '--accent': cartillaColor } as any}>
          <div className={`qr-result-icon ${passed ? 'pass' : 'fail'}`}>
            {passed ? '🏆' : '📚'}
          </div>
          <h2 className={passed ? 'result-pass' : 'result-fail'}>
            {passed ? '¡Aprobado!' : 'Sigue Practicando'}
          </h2>

          <div className="qr-score-ring" style={{ '--score': score, '--color': passed ? '#10b981' : '#f59e0b' } as any}>
            <svg viewBox="0 0 36 36">
              <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className="ring-fill"
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="ring-label">{score}%</div>
          </div>

          <div className="qr-result-stats">
            <div className="rs-item">
              <span>✅ Correctas</span>
              <strong>{correctas}/{questions.length}</strong>
            </div>
            <div className="rs-item">
              <span>⭐ XP Ganado</span>
              <strong>+{xpGanado}</strong>
            </div>
            <div className="rs-item">
              <span>⏱️ Tiempo</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
          </div>

          {passed && (
            <div className="qr-answers-review">
              <h4>Respuestas correctas</h4>
              {questions.map((q, i) => (
                <div key={q.id} className={`review-item ${answers[i] === q.respuestaCorrecta ? 'correct' : 'incorrect'}`}>
                  <div className="review-q">{i + 1}. {q.pregunta}</div>
                  <div className="review-a">✔ {q.opciones[q.respuestaCorrecta]}</div>
                  <div className="review-exp">{q.explicacion}</div>
                </div>
              ))}
            </div>
          )}

          <div className="qr-actions">
            <button
              className="qr-btn-primary"
              style={{ background: cartillaColor }}
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? 'Guardando...' : passed ? 'Recibir XP y Continuar' : 'Ver mis Cartillas'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── QUESTION / ANSWER-REVEAL ── */
  if (!currentQ) return null

  const isReveal = phase === 'answer-reveal'
  const isCorrect = selected === currentQ.respuestaCorrecta

  return (
    <div className="qr-overlay">
      <div className="qr-card qr-question" style={{ '--accent': cartillaColor } as any}>
        {/* Progress header */}
        <div className="qr-topbar">
          <div className="qr-progress-dots">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : ''}`}
                style={{ background: i <= currentIdx ? cartillaColor : undefined }}
              />
            ))}
          </div>
          <div className="qr-timer" style={{ color: elapsed > 90 ? '#ef4444' : undefined }}>
            ⏱ {formatTime(elapsed)}
          </div>
        </div>

        {/* Difficulty + points */}
        <div className="qr-meta">
          <span className={`diff diff-${currentQ.dificultad}`}>
            {currentQ.dificultad === 'facil' ? '🟢 Fácil' : currentQ.dificultad === 'medio' ? '🟡 Medio' : '🔴 Difícil'}
          </span>
          <span className="pts">{currentQ.puntos} pts</span>
        </div>

        {/* Question */}
        <p className="qr-question-text">{currentQ.pregunta}</p>

        {/* Options */}
        <div className="qr-options">
          {currentQ.opciones.map((opt, i) => {
            let cls = 'qr-option'
            if (isReveal) {
              if (i === currentQ.respuestaCorrecta) cls += ' qr-correct'
              else if (i === selected && !isCorrect) cls += ' qr-wrong'
            } else if (i === selected) {
              cls += ' qr-selected'
            }
            return (
              <button
                key={i}
                className={cls}
                style={i === selected && !isReveal ? { borderColor: cartillaColor, background: cartillaColor + '18' } : {}}
                onClick={() => handleSelect(i)}
                disabled={isReveal}
              >
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span className="opt-text">{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation on reveal */}
        {isReveal && (
          <div className={`qr-explanation ${isCorrect ? 'exp-correct' : 'exp-wrong'}`}>
            <strong>{isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}</strong>
            <p>{currentQ.explicacion}</p>
          </div>
        )}

        {/* Action button */}
        <div className="qr-actions">
          {!isReveal ? (
            <button
              className="qr-btn-primary"
              style={{ background: cartillaColor, opacity: selected === null ? 0.5 : 1 }}
              onClick={handleConfirm}
              disabled={selected === null}
            >
              Confirmar Respuesta
            </button>
          ) : (
            <button
              className="qr-btn-primary"
              style={{ background: cartillaColor }}
              onClick={handleNext}
            >
              {isLast ? 'Ver Resultados' : 'Siguiente Pregunta →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
