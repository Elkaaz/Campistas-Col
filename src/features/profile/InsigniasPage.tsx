import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import BadgeCard from '../../components/badges/BadgeCard'
import { badgeService, BADGE_DEFS, type UserBadge, type BadgeRarity } from '../../services/badgeService'
import '../../styles/pages.css'

const CATEGORIES = [
  { key: 'all',      label: '🏅 Todas' },
  { key: 'cartilla', label: '📚 Cartillas' },
  { key: 'nivel',    label: '🎖️ Niveles' },
  { key: 'reto',     label: '⛰️ Retos' },
  { key: 'especial', label: '⭐ Especial' },
] as const

const RARITY_ORDER: BadgeRarity[] = ['legendario', 'epico', 'raro', 'comun']

export default function InsigniasPage() {
  const { user, profile } = useAuth()
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'cartilla' | 'nivel' | 'reto' | 'especial'>('all')
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    // Grant semilla badge on load (always earned)
    badgeService.grantBadge(user.uid, 'semilla_badge', 'registro')

    // Check level badges based on current XP
    if (profile?.xpTotal !== undefined) {
      badgeService.checkLevelBadge(user.uid, profile.xpTotal)
    }

    // Real-time subscribe
    const unsub = badgeService.subscribeUserBadges(user.uid, (badges) => {
      setUserBadges(badges)
      setLoading(false)
    })
    return () => unsub()
  }, [user, profile?.xpTotal])

  // Build earned set
  const earnedSet = new Set(userBadges.map((b) => b.badgeId))
  const earnedMap = Object.fromEntries(userBadges.map((b) => [b.badgeId, b]))

  // Filter defs
  const allDefs = Object.values(BADGE_DEFS)
  const filtered = allDefs
    .filter((d) => filter === 'all' || d.categoria === filter)
    .sort((a, b) => {
      // earned first, then by rarity
      const aE = earnedSet.has(a.id) ? 0 : 1
      const bE = earnedSet.has(b.id) ? 0 : 1
      if (aE !== bE) return aE - bE
      return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
    })

  const totalEarned = filtered.filter((d) => earnedSet.has(d.id)).length
  const totalDefs = allDefs.length
  const totalEarnedAll = earnedSet.size

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando insignias...</div>

  return (
    <div className="insignias-page">
      {/* Header */}
      <div className="page-header">
        <h1>🏅 Mis Insignias</h1>
        <p className="page-subtitle">Desbloquea todas las insignias completando retos, cartillas y subiendo de nivel</p>
      </div>

      {/* Progress summary */}
      <div className="badges-summary">
        <div className="bs-progress">
          <div className="bs-bar-wrap">
            <div className="bs-bar" style={{ width: `${Math.round((totalEarnedAll / totalDefs) * 100)}%` }} />
          </div>
          <span className="bs-count">{totalEarnedAll}/{totalDefs} desbloqueadas</span>
        </div>
        <div className="bs-stats">
          {(['legendario', 'epico', 'raro', 'comun'] as BadgeRarity[]).map((r) => {
            const cnt = userBadges.filter((b) => BADGE_DEFS[b.badgeId]?.rarity === r).length
            return (
              <div key={r} className="bs-stat-item" style={{ borderColor: badgeService.rarityColor(r) }}>
                <strong style={{ color: badgeService.rarityColor(r) }}>{cnt}</strong>
                <span>{badgeService.rarityLabel(r)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category filter */}
      <div className="badges-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`badges-filter-btn ${filter === c.key ? 'active' : ''}`}
            onClick={() => setFilter(c.key as any)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="badges-grid">
        {filtered.map((def) => {
          const earned = earnedSet.has(def.id)
          const ub = earnedMap[def.id]
          return (
            <div key={def.id} className={`badge-slot ${earned ? 'slot-earned' : 'slot-locked'}`}>
              <BadgeCard
                badgeId={def.id}
                earned={earned}
                earnedAt={ub?.otorgadoAt}
                size="md"
                showTooltip
                animate={newBadgeId === def.id}
              />
            </div>
          )
        })}
      </div>

      {/* Earned count for filtered */}
      {filter !== 'all' && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: 16, fontSize: 14 }}>
          {totalEarned} de {filtered.length} desbloqueadas en esta categoría
        </p>
      )}

      {/* How to earn */}
      <div className="badges-howto">
        <h3>¿Cómo ganar insignias?</h3>
        <div className="howto-grid">
          <div className="howto-item">
            <span>📚</span>
            <div>
              <strong>Cartillas</strong>
              <p>Completa las cartillas y aprueba los quizzes con ≥70%</p>
            </div>
          </div>
          <div className="howto-item">
            <span>⛰️</span>
            <div>
              <strong>Retos</strong>
              <p>Publica y valida retos completados en campamento</p>
            </div>
          </div>
          <div className="howto-item">
            <span>🎖️</span>
            <div>
              <strong>Niveles</strong>
              <p>Acumula XP para subir de nivel y desbloquear insignias automáticamente</p>
            </div>
          </div>
          <div className="howto-item">
            <span>⭐</span>
            <div>
              <strong>Especiales</strong>
              <p>Logros únicos por completar hitos importantes en la plataforma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
