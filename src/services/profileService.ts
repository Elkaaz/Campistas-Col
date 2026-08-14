import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '../firebase'
import { demoStore } from '../data/demoStore'
import { User } from '../types'
import { LEVELS } from '../lib/constants'

/**
 * Calcular nivel basado en XP total
 */
function calculateLevelFromXp(xpTotal: number) {
  const levels = Object.values(LEVELS).sort((a, b) => b.orden - a.orden)

  for (const level of levels) {
    if (xpTotal >= level.xpRequerida) {
      return level
    }
  }

  return LEVELS.semilla
}

/**
 * Servicios para perfiles de usuarios
 */
export const profileService = {
  /**
   * Obtener perfil de un usuario por UID
   */
  async getProfileByUid(uid: string): Promise<User | null> {
    if (!db) return demoStore.getUser(uid)

    try {
      const docRef = doc(db, 'profiles', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          uid,
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as User
      }
      return null
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  },

  /**
   * Crear un nuevo perfil
   */
  async createProfile(
    uid: string,
    displayName: string,
    email: string,
    avatar?: string
  ): Promise<User> {
    try {
      if (!db) throw new Error('Firebase no configurado (modo demo)')

      const newProfile: User = {
        uid,
        displayName,
        email,
        avatar,
        xpTotal: 0,
        nivelActual: 'semilla',
        nivelOrden: 1,
        departamento: '',
        municipio: '',
        nombreBosque: '',
        tipoSangre: '',
        eps: '',
        rol: 'campista',
        esLider: false,
        esComiteDeptal: false,
        cartillasCompletadas: 0,
        cartillasTotal: 0,
        quizzesCompletados: 0,
        quizzesTotal: 0,
        retosPublicados: 0,
        retosValidados: 0,
        perfilCompleto: false,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, 'profiles', uid), {
        ...newProfile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      return newProfile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  },

  /**
   * Actualizar perfil
   */
  async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    if (!db) return

    try {
      await updateDoc(doc(db, 'profiles', uid), {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  /**
   * Agregar XP al usuario
   */
  async addXp(uid: string, amount: number): Promise<void> {
    if (!db) {
      demoStore.addXp(uid, amount)
      return
    }

    try {
      const profile = await this.getProfileByUid(uid)
      if (!profile) throw new Error('Perfil no encontrado')

      const newXpTotal = profile.xpTotal + amount
      const newLevel = calculateLevelFromXp(newXpTotal)

      await updateDoc(doc(db, 'profiles', uid), {
        xpTotal: newXpTotal,
        nivelActual: newLevel.id,
        nivelOrden: newLevel.orden,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error adding XP:', error)
      throw error
    }
  },

  /**
   * Obtener leaderboard global
   */
  async getLeaderboard(limitNum = 100): Promise<User[]> {
    if (!db) return demoStore.getUsers().slice(0, limitNum)

    try {
      const q = query(
        collection(db, 'profiles'),
        where('activo', '==', true),
        orderBy('xpTotal', 'desc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as User))
    } catch (error) {
      console.error('Error getting leaderboard:', error)
      return []
    }
  },

  /**
   * Obtener leaderboard local (por municipio)
   */
  async getLeaderboardLocal(
    municipio: string,
    limitNum = 50
  ): Promise<User[]> {
    if (!db) return demoStore.getUsersByMunicipio(municipio).slice(0, limitNum)

    try {
      const q = query(
        collection(db, 'profiles'),
        where('activo', '==', true),
        where('municipio', '==', municipio),
        orderBy('xpTotal', 'desc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as User))
    } catch (error) {
      console.error('Error getting local leaderboard:', error)
      return []
    }
  },

  /**
   * Obtener campistas de un municipio (bosque local)
   */
  async getCampistasLocal(municipio: string): Promise<User[]> {
    if (!db) return demoStore.getUsersByMunicipio(municipio)

    try {
      const q = query(
        collection(db, 'profiles'),
        where('activo', '==', true),
        where('municipio', '==', municipio),
        orderBy('xpTotal', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as User))
    } catch (error) {
      console.error('Error getting local campistas:', error)
      return []
    }
  },
}
