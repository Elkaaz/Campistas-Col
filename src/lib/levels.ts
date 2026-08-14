export type LevelDefinition = {
  id: string
  name: string
  minXp: number
  color: string
}

export const LEVELS: LevelDefinition[] = [
  { id: 'aspirante', name: 'Aspirante', minXp: 0, color: '#9ca3af' },
  { id: 'semilla', name: 'Semilla', minXp: 100, color: '#84cc16' },
  { id: 'raiz', name: 'Raíz', minXp: 300, color: '#8b5e3c' },
  { id: 'tallo', name: 'Tallo', minXp: 600, color: '#22c55e' },
  { id: 'hoja', name: 'Hoja', minXp: 1000, color: '#84cc16' },
  { id: 'flor', name: 'Flor', minXp: 1500, color: '#f59e0b' },
  { id: 'fruto', name: 'Fruto', minXp: 2500, color: '#ef4444' },
]

export function getLevelForXp(xp: number): LevelDefinition {
  return [...LEVELS].reverse().find((level) => xp >= level.minXp) ?? LEVELS[0]
}

export function getNextLevel(xp: number): LevelDefinition | null {
  const current = getLevelForXp(xp)
  const currentIndex = LEVELS.findIndex((level) => level.id === current.id)
  return LEVELS[currentIndex + 1] ?? null
}

export function getXpProgress(xp: number): { currentLevel: LevelDefinition; nextLevel: LevelDefinition | null; currentXpInLevel: number; xpNeeded: number; percent: number } {
  const currentLevel = getLevelForXp(xp)
  const nextLevel = getNextLevel(xp)

  const currentXpInLevel = xp - currentLevel.minXp
  const xpNeeded = nextLevel ? nextLevel.minXp - currentLevel.minXp : 0
  const percent = nextLevel ? Math.min(100, Math.round((currentXpInLevel / xpNeeded) * 100)) : 100

  return {
    currentLevel,
    nextLevel,
    currentXpInLevel,
    xpNeeded,
    percent,
  }
}
