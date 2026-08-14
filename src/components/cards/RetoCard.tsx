import { Reto } from '../../types'
import { getRetoTypeIcon, getRetoTypeLabel, getRetoTypeColor } from '../../lib/colors'
import '../../styles/components.css'

interface RetoCardProps {
  reto: Reto
  completed?: boolean
  onPublish?: (retoId: string) => void
}

/**
 * RetoCard - Card de reto disponible
 * Muestra info del reto, XP, nivel recomendado y botón para publicar
 */
export default function RetoCard({ reto, completed = false, onPublish }: RetoCardProps) {
  const color = getRetoTypeColor(reto.tipo as any)

  return (
    <article className="reto-card" style={{ borderLeftColor: color }}>
      {/* HEADER */}
      <div className="reto-card-header">
        <div className="reto-type-badge" style={{ backgroundColor: color }}>
          <span className="badge-icon">{getRetoTypeIcon(reto.tipo as any)}</span>
        </div>

        <div className="reto-title-section">
          <h3>{reto.titulo}</h3>
          <p className="reto-description">{reto.descripcion}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="reto-stats">
        <div className="stat">
          <span className="stat-label">XP</span>
          <span className="stat-value" style={{ color }}>
            +{reto.xpRecompensa}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Nivel</span>
          <span className="stat-value">{reto.nivelRecomendado}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tipo</span>
          <span className="stat-value">{getRetoTypeLabel(reto.tipo as any)}</span>
        </div>
      </div>

      {/* CRITERIOS */}
      <div className="reto-criteria">
        <details>
          <summary>Ver criterios</summary>
          <p>{reto.criteriosEvaluacion}</p>
        </details>
      </div>

      {/* FOOTER - BUTTON */}
      <div className="reto-card-footer">
        {completed ? (
          <button className="btn-primary disabled" disabled>
            ✅ Completado
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => onPublish?.(reto.retoId)}
            style={{ backgroundColor: color }}
          >
            Publicar Reto
          </button>
        )}
      </div>
    </article>
  )
}
