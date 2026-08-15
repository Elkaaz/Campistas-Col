import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CARTILLAS_LINKS, getCartillaColor, getCartillaIcon, getCartillaName } from '../../config/cartillasLinks'
import type { Cartilla, CartillaProgreso } from '../../types'
import '../../styles/pages.css'

const CARTILLAS_KEYS = Object.keys(CARTILLAS_LINKS) as Array<keyof typeof CARTILLAS_LINKS>

export default function CartillasPage() {
  const { user, profile } = useAuth()
  const [cartillas, setCartillas] = useState<Cartilla[]>([])
  const [progreso, setProgreso] = useState<Record<string, CartillaProgreso>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const cartillasData: Cartilla[] = CARTILLAS_KEYS.map((slug, index) => ({
          cartillaId: slug,
          nombre: getCartillaName(slug),
          slug: slug as string,
          descripcion: `Material de formación sobre ${getCartillaName(slug).toLowerCase()}`,
          contenido: '',
          categoria: 'formacion',
          icono: getCartillaIcon(slug),
          colorTema: getCartillaColor(slug),
          orden: index + 1,
          seccion: 'formacion',
          competidosTotal: 0,
          creadoPor: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
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
        <h1>📚 Mi Aprendizaje</h1>
        <p className="page-subtitle">
          Material de formación campamentil para tu crecimiento personal
        </p>
      </div>

      <div className="cartillas-grid">
        {cartillas.map((cartilla) => {
          const prog = progreso[cartilla.cartillaId]
          const isCompleted = prog?.completada
          const progressPercent = prog?.porcentajeLeido || 0

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
                  <span>⏱️ ~15 min</span>
                </div>
              </div>

              <div className="cartilla-footer">
                <a
                  href={getCartillaLink(cartilla.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-leer"
                  style={{ background: cartilla.colorTema }}
                >
                  📥 Descargar PDF
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
