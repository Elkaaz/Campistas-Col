import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { demoStore } from '../data/demoStore'
import type { Reto } from '../types'

/**
 * Catálogo de retos disponibles para los campistas.
 */
export async function getRetosCatalogo(): Promise<Reto[]> {
  if (!db) return demoStore.getRetos()

  try {
    const snapshot = await getDocs(collection(db, 'retos'))
    return snapshot.docs.map((document) => {
      const data = document.data()
      return {
        ...data,
        retoId: document.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Reto
    })
  } catch (error) {
    console.error('Error getting retos catalog:', error)
    return []
  }
}
