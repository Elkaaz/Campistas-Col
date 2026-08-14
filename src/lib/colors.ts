import { LEVELS, RETO_TYPES } from './constants'
import type { NivelActual, RetoTipo } from '../types'

/**
 * Obtiene el color primario de un nivel
 */
export function getLevelColor(nivel: NivelActual): string {
  return LEVELS[nivel]?.color || '#888888'
}

/**
 * Obtiene el color secundario de un nivel
 */
export function getLevelSecondaryColor(nivel: NivelActual): string {
  return LEVELS[nivel]?.colorSecondario || '#CCCCCC'
}

/**
 * Obtiene el icono emoji de un nivel
 */
export function getLevelIcon(nivel: NivelActual): string {
  return LEVELS[nivel]?.icono || '🏕️'
}

/**
 * Obtiene el nombre legible de un nivel
 */
export function getLevelName(nivel: NivelActual): string {
  return LEVELS[nivel]?.nombre || 'Desconocido'
}

/**
 * Obtiene el color de un tipo de reto
 */
export function getRetoTypeColor(tipo: RetoTipo): string {
  return RETO_TYPES[tipo]?.color || '#888888'
}

/**
 * Obtiene el icono de un tipo de reto
 */
export function getRetoTypeIcon(tipo: RetoTipo): string {
  return RETO_TYPES[tipo]?.icon || '⛰️'
}

/**
 * Obtiene el label de un tipo de reto
 */
export function getRetoTypeLabel(tipo: RetoTipo): string {
  return RETO_TYPES[tipo]?.label || 'Reto'
}

/**
 * Obtiene la descripción de un tipo de reto
 */
export function getRetoTypeDescription(tipo: RetoTipo): string {
  return RETO_TYPES[tipo]?.description || ''
}

/**
 * Calcula el progreso hacia el siguiente nivel (0-100)
 */
export function calculateLevelProgress(xpTotal: number, nivelActual: NivelActual): number {
  const currentLevel = LEVELS[nivelActual]
  if (!currentLevel) return 0

  const xpInCurrentLevel = xpTotal - currentLevel.xpRequerida
  const xpNeededForNextLevel = currentLevel.xpParaSiguiente - currentLevel.xpRequerida

  if (xpNeededForNextLevel <= 0) return 100

  return Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)))
}

/**
 * Obtiene el XP necesario para alcanzar el siguiente nivel
 */
export function getXpNeededForNextLevel(xpTotal: number, nivelActual: NivelActual): number {
  const currentLevel = LEVELS[nivelActual]
  if (!currentLevel) return 0
  return Math.max(0, currentLevel.xpParaSiguiente - xpTotal)
}

/**
 * Obtiene el siguiente nivel basado en XP total
 */
export function getNextLevel(xpTotal: number, currentLevel: NivelActual): NivelActual | null {
  const current = LEVELS[currentLevel]
  if (!current) return null

  // Si el XP es >= al requerido para el siguiente nivel
  const levels: NivelActual[] = ['semilla', 'raiz', 'tallo', 'hoja', 'flor', 'fruto']
  const currentIndex = levels.indexOf(currentLevel)

  if (currentIndex < 0 || currentIndex >= levels.length - 1) return null

  const nextLevelKey = levels[currentIndex + 1]
  const nextLevel = LEVELS[nextLevelKey]

  if (xpTotal >= nextLevel.xpRequerida) {
    return nextLevelKey
  }

  return null
}

/**
 * Obtiene el nivel basado en XP total
 */
export function getLevelFromXp(xpTotal: number): NivelActual {
  const levels: NivelActual[] = ['semilla', 'raiz', 'tallo', 'hoja', 'flor', 'fruto']

  for (let i = levels.length - 1; i >= 0; i--) {
    const level = LEVELS[levels[i]]
    if (xpTotal >= level.xpRequerida) {
      return levels[i]
    }
  }

  return 'semilla'
}
