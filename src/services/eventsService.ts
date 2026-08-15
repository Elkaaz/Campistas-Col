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
import type { Evento, EventoTipo, EventoEstado, InscripcionEvento } from '../types'

export const eventsService = {
  async getUpcomingEvents(limitNum = 20): Promise<Evento[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'events'),
        where('estado', 'in', ['proximo', 'inscripciones_abiertas']),
        orderBy('fechaInicio', 'asc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        eventoId: doc.id,
        fechaInicio: doc.data().fechaInicio?.toDate() || new Date(),
        fechaFin: doc.data().fechaFin?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Evento))
    } catch (error) {
      console.error('Error getting events:', error)
      return []
    }
  },

  async getEventById(eventoId: string): Promise<Evento | null> {
    if (!db) return null
    try {
      const docRef = doc(db, 'events', eventoId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          eventoId: docSnap.id,
          fechaInicio: docSnap.data().fechaInicio?.toDate() || new Date(),
          fechaFin: docSnap.data().fechaFin?.toDate() || new Date(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Evento
      }
      return null
    } catch (error) {
      console.error('Error getting event:', error)
      return null
    }
  },

  async createEvent(eventData: Omit<Evento, 'eventoId' | 'createdAt' | 'updatedAt' | 'inscritos'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        inscritos: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async registerForEvent(eventoId: string, inscripcion: Omit<InscripcionEvento, 'inscripcionId' | 'createdAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const inscripcionRef = doc(collection(db, 'eventRegistrations'))
      await setDoc(inscripcionRef, {
        ...inscripcion,
        createdAt: Timestamp.now(),
      })
      await updateDoc(doc(db, 'events', eventoId), {
        inscritos: increment(1),
      })
      return inscripcionRef.id
    } catch (error) {
      console.error('Error registering for event:', error)
      throw error
    }
  },

  async getUserRegistrations(uid: string): Promise<InscripcionEvento[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'eventRegistrations'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        inscripcionId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as InscripcionEvento))
    } catch (error) {
      console.error('Error getting user registrations:', error)
      return []
    }
  },
}
