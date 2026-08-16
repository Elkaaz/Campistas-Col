import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'

// ─────────────────────────────────────────────
// BADGE DEFINITIONS
// ─────────────────────────────────────────────

export type BadgeRarity = 'comun' | 'raro' | 'epico' | 'legendario'

export type BadgeDef = {
  id: string
  nombre: string
  descripcion: string
  icono: string
  colorTema: string
  colorBorde: string
  rarity: BadgeRarity
  categoria: 'cartilla' | 'reto' | 'nivel' | 'social' | 'especial'
  criterio: string   // descripción legible
}

export const BADGE_DEFS: Record<string, BadgeDef> = {
  // ── CARTILLAS ──────────────────────────────
  nudos: {
    id: 'nudos',
    nombre: 'Maestro de Nudos',
    descripcion: 'Completaste la cartilla de Técnicas Campamentiles',
    icono: '🪢',
    colorTema: '#8B4513',
    colorBorde: '#D2691E',
    rarity: 'comun',
    categoria: 'cartilla',
    criterio: 'Aprobar quiz de Técnicas Campamentiles ≥70%',
  },
  primeros_auxilios: {
    id: 'primeros_auxilios',
    nombre: 'Socorrista Campista',
    descripcion: 'Completaste la cartilla de Prevención y Salud',
    icono: '🏥',
    colorTema: '#DC143C',
    colorBorde: '#FF6B6B',
    rarity: 'comun',
    categoria: 'cartilla',
    criterio: 'Aprobar quiz de Prevención y Salud ≥70%',
  },
  naturaleza: {
    id: 'naturaleza',
    nombre: 'Guardián Verde',
    descripcion: 'Completaste la cartilla de Conciencia Ambiental',
    icono: '🌿',
    colorTema: '#2E8B57',
    colorBorde: '#3CB371',
    rarity: 'raro',
    categoria: 'cartilla',
    criterio: 'Aprobar quiz de Conciencia Ambiental ≥70%',
  },
  liderazgo: {
    id: 'liderazgo',
    nombre: 'Líder Forestal',
    descripcion: 'Completaste la cartilla de Formación y Liderazgo',
    icono: '👑',
    colorTema: '#4169E1',
    colorBorde: '#6495ED',
    rarity: 'raro',
    categoria: 'cartilla',
    criterio: 'Aprobar quiz de Formación y Liderazgo ≥70%',
  },
  organización: {
    id: 'organización',
    nombre: 'Organizador Oficial',
    descripcion: 'Completaste la Guía Técnica de Campamentos Juveniles',
    icono: '📋',
    colorTema: '#FF6347',
    colorBorde: '#FF8C69',
    rarity: 'epico',
    categoria: 'cartilla',
    criterio: 'Aprobar quiz de Guía Técnica ≥70%',
  },
  // ── LOGROS ESPECIALES ──────────────────────
  completista: {
    id: 'completista',
    nombre: 'Campista Completo',
    descripcion: 'Completaste TODAS las cartillas de formación',
    icono: '🏆',
    colorTema: '#FFD700',
    colorBorde: '#FFA500',
    rarity: 'legendario',
    categoria: 'especial',
    criterio: 'Aprobar los 5 quizzes con ≥70%',
  },
  // ── NIVELES ────────────────────────────────
  semilla_badge: {
    id: 'semilla_badge',
    nombre: 'Semilla',
    descripcion: 'Iniciaste tu camino como campista',
    icono: '🌱',
    colorTema: '#8B7355',
    colorBorde: '#A0896C',
    rarity: 'comun',
    categoria: 'nivel',
    criterio: 'Registrarte en la plataforma',
  },
  raiz_badge: {
    id: 'raiz_badge',
    nombre: 'Raíz Firme',
    descripcion: 'Alcanzaste el nivel Raíz (500 XP)',
    icono: '🪴',
    colorTema: '#654321',
    colorBorde: '#8B6347',
    rarity: 'comun',
    categoria: 'nivel',
    criterio: 'Acumular 500 XP',
  },
  tallo_badge: {
    id: 'tallo_badge',
    nombre: 'Tallo Fuerte',
    descripcion: 'Alcanzaste el nivel Tallo (1500 XP)',
    icono: '🌿',
    colorTema: '#228B22',
    colorBorde: '#32CD32',
    rarity: 'raro',
    categoria: 'nivel',
    criterio: 'Acumular 1500 XP',
  },
  hoja_badge: {
    id: 'hoja_badge',
    nombre: 'Hoja Extendida',
    descripcion: 'Alcanzaste el nivel Hoja (3500 XP)',
    icono: '🍃',
    colorTema: '#32CD32',
    colorBorde: '#7FFF00',
    rarity: 'raro',
    categoria: 'nivel',
    criterio: 'Acumular 3500 XP',
  },
  flor_badge: {
    id: 'flor_badge',
    nombre: 'Flor Abierta',
    descripcion: 'Alcanzaste el nivel Flor (7500 XP)',
    icono: '🌸',
    colorTema: '#FF69B4',
    colorBorde: '#FFB6C1',
    rarity: 'epico',
    categoria: 'nivel',
    criterio: 'Acumular 7500 XP',
  },
  fruto_badge: {
    id: 'fruto_badge',
    nombre: 'Fruto Maduro',
    descripcion: 'Alcanzaste el nivel Fruto (15000 XP)',
    icono: '🍎',
    colorTema: '#FF4500',
    colorBorde: '#FFD700',
    rarity: 'legendario',
    categoria: 'nivel',
    criterio: 'Acumular 15000 XP',
  },
  // ── SOCIAL ─────────────────────────────────
  primer_reto: {
    id: 'primer_reto',
    nombre: 'Primer Fogón',
    descripcion: 'Publicaste tu primer reto completado',
    icono: '🔥',
    colorTema: '#FF4500',
    colorBorde: '#FF6347',
    rarity: 'comun',
    categoria: 'reto',
    criterio: 'Publicar tu primer post de reto',
  },
  cinco_retos: {
    id: 'cinco_retos',
    nombre: 'Campista Activo',
    descripcion: 'Completaste 5 retos validados',
    icono: '⛺',
    colorTema: '#228B22',
    colorBorde: '#32CD32',
    rarity: 'raro',
    categoria: 'reto',
    criterio: 'Tener 5 retos validados por un líder',
  },
}

export type UserBadge = {
  uid: string
  badgeId: string
  otorgadoAt: Date
  source: string // 'quiz' | 'nivel' | 'reto' | 'registro'
}

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

export const badgeService = {
  /**
   * Obtener todos los badges de un usuario
   */
  async getUserBadges(uid: string): Promise<UserBadge[]> {
    if (!db) return []
    try {
      const q = query(collection(db, 'userBadges'), where('uid', '==', uid))
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({
        ...d.data(),
        otorgadoAt: d.data().otorgadoAt?.toDate() || new Date(),
      } as UserBadge))
    } catch (e) {
      console.error('Error getting user badges:', e)
      return []
    }
  },

  /**
   * Escuchar badges en tiempo real
   */
  subscribeUserBadges(uid: string, callback: (badges: UserBadge[]) => void): Unsubscribe {
    if (!db) return () => {}
    const q = query(collection(db, 'userBadges'), where('uid', '==', uid))
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({
        ...d.data(),
        otorgadoAt: d.data().otorgadoAt?.toDate() || new Date(),
      } as UserBadge)))
    })
  },

  /**
   * Otorgar un badge (idempotente — no duplica)
   */
  async grantBadge(uid: string, badgeId: string, source: string): Promise<boolean> {
    if (!db) return false
    try {
      const docId = `${uid}_${badgeId}`
      await setDoc(
        doc(db, 'userBadges', docId),
        { uid, badgeId, source, otorgadoAt: Timestamp.now() },
        { merge: true }
      )
      return true
    } catch (e) {
      console.error('Error granting badge:', e)
      return false
    }
  },

  /**
   * Verificar si usuario tiene un badge
   */
  async hasBadge(uid: string, badgeId: string): Promise<boolean> {
    if (!db) return false
    try {
      const snap = await getDocs(
        query(collection(db, 'userBadges'), where('uid', '==', uid), where('badgeId', '==', badgeId))
      )
      return !snap.empty
    } catch {
      return false
    }
  },

  /**
   * Verificar y otorgar badge de nivel según XP
   */
  async checkLevelBadge(uid: string, xpTotal: number): Promise<string | null> {
    const levelMap = [
      { xp: 15000, badge: 'fruto_badge' },
      { xp: 7500,  badge: 'flor_badge' },
      { xp: 3500,  badge: 'hoja_badge' },
      { xp: 1500,  badge: 'tallo_badge' },
      { xp: 500,   badge: 'raiz_badge' },
      { xp: 0,     badge: 'semilla_badge' },
    ]
    for (const { xp, badge } of levelMap) {
      if (xpTotal >= xp) {
        const already = await badgeService.hasBadge(uid, badge)
        if (!already) {
          await badgeService.grantBadge(uid, badge, 'nivel')
          return badge
        }
        break
      }
    }
    return null
  },

  /**
   * Verificar si completó todas las cartillas y otorgar badge completista
   */
  async checkCompletistaBadge(uid: string): Promise<boolean> {
    if (!db) return false
    try {
      const snap = await getDocs(
        query(collection(db, 'cartillasProgreso'), where('uid', '==', uid), where('completada', '==', true))
      )
      const TOTAL_CARTILLAS = 5
      if (snap.size >= TOTAL_CARTILLAS) {
        const already = await badgeService.hasBadge(uid, 'completista')
        if (!already) {
          await badgeService.grantBadge(uid, 'completista', 'quiz')
          return true
        }
      }
    } catch (e) {
      console.error('Error checking completista badge:', e)
    }
    return false
  },

  /**
   * Obtener definición de badge
   */
  getDef(badgeId: string): BadgeDef | null {
    return BADGE_DEFS[badgeId] || null
  },

  /**
   * Rareza → color CSS
   */
  rarityColor(rarity: BadgeRarity): string {
    return {
      comun:      '#9ca3af',
      raro:       '#3b82f6',
      epico:      '#8b5cf6',
      legendario: '#f59e0b',
    }[rarity]
  },

  rarityLabel(rarity: BadgeRarity): string {
    return { comun: 'Común', raro: 'Raro', epico: 'Épico', legendario: 'Legendario' }[rarity]
  },
}
