import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { getLevelForXp } from '../lib/levels'
import type { CampistaProfile } from '../types'

export type LeaderboardEntry = {
  rank: number
  uid: string
  nombre: string
  departamento: string
  nivel: string
  xp: number
}

/**
 * Obtiene el leaderboard global ordenado por XP
 */
export async function getLeaderboardGlobal(pageSize: number = 50): Promise<LeaderboardEntry[]> {
  if (!db) return []

  try {
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('perfilCompleto', '==', true),
        orderBy('xpTotal', 'desc'),
        limit(pageSize),
      ),
    )

    return snap.docs.map((doc, index) => {
      const data = doc.data() as CampistaProfile
      const level = getLevelForXp(data.xpTotal)

      return {
        rank: index + 1,
        uid: data.uid,
        nombre: data.displayName,
        departamento: data.departamento,
        nivel: level.name,
        xp: data.xpTotal,
      }
    })
  } catch (error) {
    console.error('Error fetching global leaderboard:', error)
    return []
  }
}

/**
 * Obtiene el leaderboard por departamento
 */
export async function getLeaderboardPorDepartamento(
  departamento: string,
  pageSize: number = 50,
): Promise<LeaderboardEntry[]> {
  if (!db) return []

  try {
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('perfilCompleto', '==', true),
        where('departamento', '==', departamento),
        orderBy('xpTotal', 'desc'),
        limit(pageSize),
      ),
    )

    return snap.docs.map((doc, index) => {
      const data = doc.data() as CampistaProfile
      const level = getLevelForXp(data.xpTotal)

      return {
        rank: index + 1,
        uid: data.uid,
        nombre: data.displayName,
        departamento: data.departamento,
        nivel: level.name,
        xp: data.xpTotal,
      }
    })
  } catch (error) {
    console.error('Error fetching department leaderboard:', error)
    return []
  }
}

/**
 * Obtiene la posición de un campista en el leaderboard global
 */
export async function getRankingCampista(uid: string): Promise<LeaderboardEntry | null> {
  if (!db) return null

  try {
    const profileRef = doc(db, 'profiles', uid)
    const profileSnap = await getDoc(profileRef)

    if (!profileSnap.exists()) return null

    const profile = profileSnap.data() as CampistaProfile

    // Contar cuántos campistas tienen más XP
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('perfilCompleto', '==', true),
        where('xpTotal', '>', profile.xpTotal),
      ),
    )

    const rank = snap.size + 1
    const level = getLevelForXp(profile.xpTotal)

    return {
      rank,
      uid: profile.uid,
      nombre: profile.displayName,
      departamento: profile.departamento,
      nivel: level.name,
      xp: profile.xpTotal,
    }
  } catch (error) {
    console.error('Error fetching campista ranking:', error)
    return null
  }
}

/**
 * Sincroniza la colección de leaderboard (debería correr como Cloud Function en producción)
 * Esto es un placeholder para operaciones administrativas
 */
export async function sincronizarLeaderboard(): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')

  try {
    const batch = writeBatch(db)

    const snap = await getDocs(
      query(collection(db, 'profiles'), where('perfilCompleto', '==', true), orderBy('xpTotal', 'desc')),
    )

    const leaderboardCollection = collection(db, 'leaderboard')

    snap.docs.forEach((snapshot, index) => {
      const profile = snapshot.data() as CampistaProfile
      const level = getLevelForXp(profile.xpTotal)

      const leaderboardRef = doc(leaderboardCollection)
      batch.set(leaderboardRef, {
        rank: index + 1,
        uid: profile.uid,
        nombre: profile.displayName,
        departamento: profile.departamento,
        nivel: level.name,
        xp: profile.xpTotal,
        updatedAt: new Date().toISOString(),
      })
    })

    await batch.commit()
  } catch (error) {
    console.error('Error syncing leaderboard:', error)
    throw error
  }
}
