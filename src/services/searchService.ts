import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { CampistaProfile } from '../types'

export interface SearchFilters {
  departamento?: string
  municipio?: string
  nivel?: string
  rol?: string
  searchQuery?: string
}

export const searchService = {
  async searchCampistas(filters: SearchFilters, pageSize = 20, lastDoc?: DocumentSnapshot): Promise<{ data: CampistaProfile[]; lastVisible?: DocumentSnapshot }> {
    if (!db) return { data: [] }

    try {
      let q = query(
        collection(db, 'profiles'),
        where('activo', '==', true),
        orderBy('xpTotal', 'desc'),
        limit(pageSize)
      )

      if (filters.departamento) {
        q = query(q, where('departamento', '==', filters.departamento))
      }
      if (filters.municipio) {
        q = query(q, where('municipio', '==', filters.municipio))
      }
      if (filters.nivel) {
        q = query(q, where('nivelActual', '==', filters.nivel))
      }
      if (filters.rol) {
        q = query(q, where('rol', '==', filters.rol))
      }

      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as CampistaProfile))

      return {
        data,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || undefined,
      }
    } catch (error) {
      console.error('Error searching campistas:', error)
      return { data: [] }
    }
  },

  async getDepartamentos(): Promise<string[]> {
    if (!db) return []
    try {
      const snapshot = await getDocs(collection(db, 'profiles'))
      const departamentos = new Set<string>()
      snapshot.docs.forEach(doc => {
        const dept = doc.data().departamento
        if (dept) departamentos.add(dept)
      })
      return Array.from(departamentos).sort()
    } catch (error) {
      console.error('Error getting departamentos:', error)
      return []
    }
  },

  async getMunicipiosByDepartamento(departamento: string): Promise<string[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'profiles'),
        where('departamento', '==', departamento),
        where('activo', '==', true)
      )
      const snapshot = await getDocs(q)
      const municipios = new Set<string>()
      snapshot.docs.forEach(doc => {
        const mun = doc.data().municipio
        if (mun) municipios.add(mun)
      })
      return Array.from(municipios).sort()
    } catch (error) {
      console.error('Error getting municipios:', error)
      return []
    }
  },
}
