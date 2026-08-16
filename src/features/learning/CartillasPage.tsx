import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CARTILLAS_LINKS, getCartillaColor, getCartillaIcon, getCartillaName } from '../../config/cartillasLinks'

const getCartillaLink = (slug: string): string => {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.enlacePdf || '#'
}
import type { Cartilla, CartillaProgreso } from '../../types'
import '../../styles/pages.css'

const CARTILLAS_KEYS = Object.keys(CARTILLAS_LINKS) as Array<keyof typeof CARTILLAS_LINKS>

const ROL_LABELS: Record<string, string> = {
  campista: 'Campista',
  lider_bosque: 'Líder de Bosque',
  comite_departamental: 'Comité Departamental',
  admin: 'Admin',
}

export default function CartillasPage() {
  const { user, profile } = useAuth()
  const [cartillas, setCartillas] = useState<Cartilla[]>([])
  const [progreso, setProgreso] = useState<Record<string, CartillaProgreso>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const cartillasData: Cartilla[] = CARTILLAS_KEYS.map((slug) => {
          const meta = CARTILLAS_LINKS[slug]
          return {
            cartillaId: slug,
            nombre: getCartillaName(slug),
            slug: slug as string,
            descripcion: `Material de formación sobre ${getCartillaName(slug).toLowerCase()}`,
            contenido: '',
            categoria: 'formacion',
            icono: getCartillaIcon(slug),
            colorTema: getCartillaColor(slug),
            orden: 0,
            seccion: 'formacion',
            competidosTotal: 0,
            creadoPor: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
            xpAlCompletar: (meta as any).xpAlCompletar ?? 0,
            insigniaOtorgada: (meta as any).insigniaOtorgada,
            nivelMinimo: (meta as any).nivelMinimo ?? 'semilla',
            requisitosPrevios: (meta as any).requisitosPrevios ?? [],
          }
        })
        setCartillas(cartillasData)

        if (user) {
          const prog: Record<string, CartillaProgreso> = {}
          cartillasData.forEach(c => {
            prog[c.cartillaId] = {
              uid: user.uid,
              cartillaId: c.cartillaId,
              completada: false,
              porcentajeLeido: 0,
              fechaInicio: new Date(),
              tiempoDedicado: 0,
            }
          })
          setProgreso(prog)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando cartillas...</div>

  return (
    <div className="cartillas-page">
      <div className="page-header">
        <h1>📚 Formación</h1>
        <p className="page-subtitle">
          Cartillas de formación campamentil — lee, aprende y sube de nivel
        </p>
      </div>

      <div className="cartillas-grid">
        {cartillas.map((cartilla) => {
          const prog = progreso[cartilla.cartillaId]
          const isCompleted = prog?.completada
          const progressPercent = prog?.porcentajeLeido || 0
          const meta = CARTILLAS_LINKS[cartilla.slug as keyof typeof CARTILLAS_LINKS] as any
          const tiempoMin = meta?.tiempoEstimadoMin ?? 15
          const nivelMin = cartilla.nivelMinimo ?? 'semilla'
          const rolHabilita = meta?.rolHabilita
          const insignia = cartilla.insigniaOtorgada
          const xp = cartilla.xpAlCompletar ?? 0
          const prereqs = cartilla.requisitosPrevios ?? []

          return (
            <div
              key={cartilla.cartillaId}
              className={`cartilla-card ${isCompleted ? 'cartilla-done' : ''}`}
            >
              <div className="cartilla-cover" style={{ background: cartilla.colorTema }}>
                <div className="cartilla-cover-overlay" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
                <div className="cartilla-cover-info">
                  <span className="cartilla-cover-icon">{cartilla.icono}</span>
                  {isCompleted && (
                    <span className="cartilla-completed-badge">✅ Completada</span>
                  )}
                </div>
              </div>

              <div className="cartilla-content">
                <h3 className="cartilla-title">{cartilla.nombre}</h3>
                <p className="cartilla-description">{cartilla.descripcion}</p>

                <div className="cartilla-meta">
                  <span className="cartilla-meta-badge" style={{ background: cartilla.colorTema }}>
                    🎖️ Nivel mínimo: {nivelMin}
                  </span>
                  {rolHabilita && (
                    <span className="cartilla-meta-badge" style={{ background: '#4169E1' }}>
                      👑 Habilita: {ROL_LABELS[rolHabilita] ?? rolHabilita}
                    </span>
                  )}
                  {insignia && (
                    <span className="cartilla-meta-badge" style={{ background: '#f59e0b' }}>
                      🏅 Insignia: {insignia}
                    </span>
                  )}
                  <span className="cartilla-meta-badge" style={{ background: '#10b981' }}>
                    ⭐ +{xp} XP
                  </span>
                </div>

                {prereqs.length > 0 && (
                  <div className="cartilla-prereqs">
                    <small>Requisitos previos:</small>
                    <div className="prereq-chips">
                      {prereqs.map((slug) => (
                        <span key={slug} className="prereq-chip" style={{ borderColor: getCartillaColor(slug) }}>
                          {getCartillaIcon(slug)} {getCartillaName(slug)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="cartilla-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        background: cartilla.colorTema,
                      }}
                    />
                  </div>
                  <small>{Math.round(progressPercent)}%</small>
                </div>

                <div className="cartilla-stats">
                  <span>📖 Lectura</span>
                  <span>⏱️ ~{tiempoMin} min</span>
                </div>
              </div>

              <div className="cartilla-footer">
                <a
                  href={(CARTILLAS_LINKS[cartilla.slug as keyof typeof CARTILLAS_LINKS] as any)?.enlacePdf || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-leer"
                  style={{ background: cartilla.colorTema }}
                >
                  📥 Descargar PDF
                </a>
                <Link
                  to={`/aprendizaje/cartillas/${cartilla.slug}`}
                  className="btn-read"
                  style={{ background: cartilla.colorTema }}
                >
                  📖 Leer en App
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
