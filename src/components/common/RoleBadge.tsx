import { ROLE_COLORS, ROLE_EMOJIS, ROLE_LABELS } from '../../lib/constants'

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md'
}

export default function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const color = ROLE_COLORS[role] || '#6b7280'
  const emoji = ROLE_EMOJIS[role] || '🎖️'
  const label = ROLE_LABELS[role] || role

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: 12,
        background: `${color}22`,
        border: `1.5px solid ${color}`,
        color,
        fontSize: size === 'sm' ? 11 : 13,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
