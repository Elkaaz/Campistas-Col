import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
  writeBatch,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export type Reto = {
  id: string
  titulo: string
  descripcion: string
  xpRecompensa: number
  categoria: string
  dificultad: 'facil' | 'medio' | 'dificil'
  requiereValidacion: boolean
  createdAt: string
}

export type PublicacionReto = {
  id: string
  retoId: string
  uid: string
  evidencia: string
  estado: 'pendiente' | 'validado' | 'rechazado'
  createdAt: string
  validadoEn?: string
  validadorUid?: string
}

export type ValidacionReto = {
  id: string
  publicacionId: string
  retoId: string
  uid: string
  validadorUid: string
  aprobado: boolean
  comentario?: string
  xpAsignado: number
  createdAt: string
}

/**
 * Obtiene todos los retos disponibles
 */
export async function getRetos(): Promise<Reto[]> {
  if (!db) return []

  try {
    const snap = await getDocs(collection(db, 'retos'))
    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Reto))
  } catch (error) {
    console.error('Error fetching retos:', error)
    return []
  }
}

/**
 * Obtiene un reto específico
 */
export async function getReto(retoId: string): Promise<Reto | null> {
  if (!db) return null

  try {
    const doc_ref = doc(db, 'retos', retoId)
    const doc_snap = await getDoc(doc_ref)

    if (!doc_snap.exists()) return null
    return { ...doc_snap.data(), id: doc_snap.id } as Reto
  } catch (error) {
    console.error('Error fetching reto:', error)
    return null
  }
}

/**
 * Publica una solución para un reto por parte de un campista
 */
export async function publicarSolucionReto(
  retoId: string,
  uid: string,
  evidencia: string,
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized')

  try {
    const publicacionRef = doc(collection(db, 'retos', retoId, 'publicaciones'))

    const publicacion: Omit<PublicacionReto, 'id'> = {
      retoId,
      uid,
      evidencia,
      estado: 'pendiente',
      createdAt: new Date().toISOString(),
    }

    await setDoc(publicacionRef, publicacion)

    // Registrar actividad
    await registrarActividad(uid, 'RETO_PUBLICADO', {
      retoId,
      publicacionId: publicacionRef.id,
    })

    return publicacionRef.id
  } catch (error) {
    console.error('Error publishing reto solution:', error)
    throw error
  }
}

/**
 * Obtiene las publicaciones pendientes de validación
 */
export async function getPublicacionesPendientes(
  retoId?: string,
): Promise<PublicacionReto[]> {
  if (!db) return []

  try {
    if (!retoId) {
      // Obtener todas las publicaciones pendientes de todos los retos
      const snap = await getDocs(
        query(collection(db, 'publicacionesRetos'), where('estado', '==', 'pendiente')),
      )
      return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PublicacionReto))
    }

    // Obtener publicaciones pendientes de un reto específico
    const snap = await getDocs(
      query(
        collection(db, 'retos', retoId, 'publicaciones'),
        where('estado', '==', 'pendiente'),
      ),
    )
    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PublicacionReto))
  } catch (error) {
    console.error('Error fetching pending publications:', error)
    return []
  }
}

/**
 * Valida una solución de reto como líder y asigna XP
 */
export async function validarSolucionReto(
  retoId: string,
  publicacionId: string,
  validadorUid: string,
  aprobado: boolean,
  comentario?: string,
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')

  const batch = writeBatch(db)

  try {
    // Obtener la publicación
    const pubRef = doc(db, 'retos', retoId, 'publicaciones', publicacionId)
    const pubSnap = await getDoc(pubRef)

    if (!pubSnap.exists()) throw new Error('Publication not found')

    const publicacion = pubSnap.data() as PublicacionReto
    const reto = await getReto(retoId)

    if (!reto) throw new Error('Reto not found')

    // Actualizar estado de la publicación
    batch.update(pubRef, {
      estado: aprobado ? 'validado' : 'rechazado',
      validadorUid,
      validadoEn: new Date().toISOString(),
    })

    // Si es aprobado, asignar XP al campista
    if (aprobado) {
      const profileRef = doc(db, 'profiles', publicacion.uid)
      batch.update(profileRef, {
        xpTotal: increment(reto.xpRecompensa),
      })

      // Registrar validación
      const validacionRef = doc(collection(db, 'validaciones'))
      batch.set(validacionRef, {
        publicacionId,
        retoId,
        uid: publicacion.uid,
        validadorUid,
        aprobado: true,
        comentario,
        xpAsignado: reto.xpRecompensa,
        createdAt: new Date().toISOString(),
      })

      // Registrar actividad
      await registrarActividad(publicacion.uid, 'RETO_VALIDADO', {
        retoId,
        xpAsignado: reto.xpRecompensa,
      })
    }

    await batch.commit()
  } catch (error) {
    console.error('Error validating reto solution:', error)
    throw error
  }
}

/**
 * Registra una actividad en el log de auditoría
 */
async function registrarActividad(uid: string, tipo: string, datos: Record<string, unknown>) {
  if (!db) return

  try {
    const logRef = doc(collection(db, 'logsActividad'))
    await setDoc(logRef, {
      uid,
      tipo,
      datos,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error registering activity:', error)
  }
}
