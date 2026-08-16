import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BadgeCard from '../../components/badges/BadgeCard'
import { badgeService, BADGE_DEFS, type UserBadge } from '../../services/badgeService'
import type { CampistaProfile } from '../../types'

export default function ProfileInsignias({ profile }: { profile: CampistaProfile }) {
  const { user } = useAuth()
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const unsub = badgeService.subscribeUserBadges(user.uid, (badges) => {
      setUserBadges(badges)
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  const earnedSet = new Set(userBadges.map((b) => b.badgeId))
  const earnedMap = Object.fromEntries(userBadges.map((b) => [b.badgeId, b]))

  // Show at most 6 badges in the preview: earned first, then locked
  const preview = Object.values(BADGE_DEFS)
    .sort((a, b) => {
      const aE = earnedSet.has(a.id) ? 0 : 1
      const bE = earnedSet.has(b.id) ? 0 : 1
      return aE - bE
    })
    .slice(0, 6)

  const total = Object.keys(BADGE_DEFS).length

  if (loading) return null

  return (
    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          🏅 Mis Insignias ({earnedSet.size}/{total})
        </h3>
        <Link
          to="/insignias"
          style={{ fontSize: 13, color: '#228B22', fontWeight: 600, textDecoration: 'none' }}
        >
          Ver todas →
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
        {preview.map((def) => (
          <BadgeCard
            key={def.id}
            badgeId={def.id}
            earned={earnedSet.has(def.id)}
            earnedAt={earnedMap[def.id]?.otorgadoAt}
            size="sm"
            showTooltip
          />
        ))}
      </div>

      {earnedSet.size === 0 && (
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '8px 0 0', fontStyle: 'italic' }}>
          Completa cartillas y retos para ganar tu primera insignia
        </p>
      )}
    </div>
  )
}
