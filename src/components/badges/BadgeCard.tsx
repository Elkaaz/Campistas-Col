import { useState } from 'react'
import { badgeService, type BadgeDef, type BadgeRarity } from '../../services/badgeService'
import './BadgeCard.css'

type BadgeCardProps = {
  badgeId: string
  earned?: boolean
  earnedAt?: Date
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  animate?: boolean   // play unlock animation
}

const SIZE_MAP = { sm: 48, md: 72, lg: 96 }

export default function BadgeCard({
  badgeId,
  earned = false,
  earnedAt,
  size = 'md',
  showTooltip = true,
  animate = false,
}: BadgeCardProps) {
  const [tooltip, setTooltip] = useState(false)
  const def = badgeService.getDef(badgeId)
  if (!def) return null

  const px = SIZE_MAP[size]
  const rarityColor = badgeService.rarityColor(def.rarity)

  return (
    <div
      className={`badge-card badge-${size} ${earned ? 'badge-earned' : 'badge-locked'} ${animate ? 'badge-animate' : ''}`}
      style={{ '--rarity-color': rarityColor, '--badge-color': def.colorTema, '--badge-border': def.colorBorde, '--px': `${px}px` } as any}
      onMouseEnter={() => showTooltip && setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      {/* Hexagon shell */}
      <div className="badge-hex">
        <svg viewBox="0 0 100 115" className="badge-hex-bg">
          <polygon
            points="50 5, 95 27.5, 95 87.5, 50 110, 5 87.5, 5 27.5"
            fill={earned ? def.colorTema : '#d1d5db'}
            stroke={earned ? def.colorBorde : '#9ca3af'}
            strokeWidth="3"
          />
          {/* Rarity glow ring */}
          {earned && (
            <polygon
              points="50 5, 95 27.5, 95 87.5, 50 110, 5 87.5, 5 27.5"
              fill="none"
              stroke={rarityColor}
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.6"
            />
          )}
          {/* Inner shine */}
          {earned && (
            <ellipse cx="50" cy="38" rx="22" ry="12" fill="rgba(255,255,255,0.18)" />
          )}
        </svg>

        {/* Icon */}
        <div className="badge-icon-wrap">
          <span className="badge-icon" style={{ filter: earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>
            {earned ? def.icono : '🔒'}
          </span>
        </div>
      </div>

      {/* Label */}
      {size !== 'sm' && (
        <div className="badge-label">
          <span className="badge-name" style={{ color: earned ? '#1a1a1a' : '#9ca3af' }}>{def.nombre}</span>
          {earned && <span className="badge-rarity" style={{ color: rarityColor }}>{badgeService.rarityLabel(def.rarity)}</span>}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div className="badge-tooltip">
          <div className="bt-header" style={{ background: earned ? def.colorTema : '#6b7280' }}>
            <span className="bt-icon">{earned ? def.icono : '🔒'}</span>
            <div>
              <strong>{def.nombre}</strong>
              <span className="bt-rarity" style={{ color: earned ? '#fff' : '#d1d5db' }}>
                {badgeService.rarityLabel(def.rarity)}
              </span>
            </div>
          </div>
          <div className="bt-body">
            <p>{def.descripcion}</p>
            <div className="bt-criterio">
              <span>📋</span> <em>{def.criterio}</em>
            </div>
            {earned && earnedAt && (
              <div className="bt-date">
                ✅ Obtenida el {earnedAt.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
            {!earned && <div className="bt-locked">Aún no desbloqueada</div>}
          </div>
        </div>
      )}

      {/* Unlock animation overlay */}
      {animate && earned && <div className="badge-unlock-burst" />}
    </div>
  )
}
