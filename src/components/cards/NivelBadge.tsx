import { NivelActual } from '../../types'
import { getLevelColor } from '../../lib/colors'
import '../../styles/components.css'

interface NivelBadgeProps {
  nivel: NivelActual
  size?: 'small' | 'medium' | 'large'
  showName?: boolean
}

const NIVEL_EMOJIS: Record<string, string> = {
  semilla: '🌱', raiz: '🌿', tallo: '🌾',
  hoja: '🍃', flor: '🌸', fruto: '🍎',
}

export default function NivelBadge({ nivel, size = 'medium', showName = true }: NivelBadgeProps) {
  const color = getLevelColor(nivel)
  const name  = nivel.charAt(0).toUpperCase() + nivel.slice(1)

  return (
    <div
      className={`nivel-badge nivel-badge-${size}`}
      style={{ backgroundColor: color }}
      title={`Nivel ${name}`}
    >
      {/* Imagen PNG del nivel – si falla, muestra emoji */}
      <img
        src={`/images/niveles/${nivel}.png`}
        alt={name}
        className="nivel-badge-img"
        onError={(e) => {
          const img = e.target as HTMLImageElement
          img.style.display = 'none'
          const fallback = img.nextElementSibling as HTMLElement
          if (fallback) fallback.style.display = 'inline'
        }}
      />
      <span className="nivel-badge-emoji" style={{ display: 'none' }}>
        {NIVEL_EMOJIS[nivel] ?? '🏕️'}
      </span>
      {showName && <span className="nivel-name">{name}</span>}
    </div>
  )
}
