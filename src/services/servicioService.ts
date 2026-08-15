import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Servicio, CreateServicioInput } from '../types'

export const servicioService = {
  async getServiciosByUser(uid: string): Promise<Servicio[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'servicios'),
        where('uid', '==', uid),
        orderBy('fecha', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        servicioId: doc.id,
        fecha: doc.data().fecha?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Servicio))
    } catch (error) {
      console.error('Error getting servicios:', error)
      return []
    }
  },

  async createServicio(uid: string, input: CreateServicioInput): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const docRef = await addDoc(collection(db, 'servicios'), {
        uid,
        ...input,
        estado: 'pendiente',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating servicio:', error)
      throw error
    }
  },

  async validateServicio(servicioId: string, validadorUid: string, validadorNombre: string): Promise<void> {
    if (!db) return
    try {
      await updateDoc(doc(db, 'servicios', servicioId), {
        estado: 'validado',
        validadoPor: validadorUid,
        validadorNombre,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error validating servicio:', error)
      throw error
    }
  },

  async getTotalHoras(uid: string): Promise<number> {
    if (!db) return 0
    try {
      const q = query(
        collection(db, 'servicios'),
        where('uid', '==', uid),
        where('estado', '==', 'validado')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.reduce((total, doc) => total + (doc.data().horas || 0), 0)
    } catch (error) {
      console.error('Error getting total horas:', error)
      return 0
    }
  },
}
