import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'

export type CartillaProgreso = {
  uid: string
  cartillaId: string
  completado: boolean
  progreso: number // 0-100
  fueCompletadoEn?: string
  createdAt: string
}

export type IntentoQuiz = {
  id: string
  uid: string
  quizId: string
  respuestas: Record<string, string> // preguntaId -> respuestaId
  calificacion: number // 0-100
  aprobado: boolean
  createdAt: string
}

/**
 * Obtiene el progreso de un campista en una cartilla
 */
export async function getCartillaProgreso(
  uid: string,
  cartillaId: string,
): Promise<CartillaProgreso | null> {
  if (!db) return null

  try {
    const ref = doc(db, 'cartillas', cartillaId, 'progreso', uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      // Crear registro inicial
      const nuevoProgreso: CartillaProgreso = {
        uid,
        cartillaId,
        completado: false,
        progreso: 0,
        createdAt: new Date().toISOString(),
      }
      await setDoc(ref, nuevoProgreso)
      return nuevoProgreso
    }

    return snap.data() as CartillaProgreso
  } catch (error) {
    console.error('Error fetching cartilla progress:', error)
    return null
  }
}

/**
 * Marca una cartilla como completada y asigna XP
 */
export async function completarCartilla(uid: string, cartillaId: string, xpRecompensa: number): Promise<void> {
  if (!db) throw new Error('Firestore not initialized')

  try {
    const batch = writeBatch(db)

    // Actualizar progreso
    const progresoRef = doc(db, 'cartillas', cartillaId, 'progreso', uid)
    batch.update(progresoRef, {
      completado: true,
      progreso: 100,
      fueCompletadoEn: new Date().toISOString(),
    })

    // Asignar XP
    const profileRef = doc(db, 'profiles', uid)
    batch.update(profileRef, {
      xpTotal: increment(xpRecompensa),
    })

    await batch.commit()
  } catch (error) {
    console.error('Error completing cartilla:', error)
    throw error
  }
}

/**
 * Obtiene las preguntas de un quiz
 */
export async function getQuizPreguntas(quizId: string) {
  if (!db) return []

  try {
    const snap = await getDocs(query(collection(db, 'preguntas'), where('quizId', '==', quizId)))
    return snap.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return []
  }
}

/**
 * Obtiene las opciones de respuesta de una pregunta
 */
export async function getPreguntaRespuestas(preguntaId: string) {
  if (!db) return []

  try {
    const snap = await getDocs(query(collection(db, 'respuestas'), where('preguntaId', '==', preguntaId)))
    return snap.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error fetching question answers:', error)
    return []
  }
}

/**
 * Envía las respuestas de un quiz y calcula la calificación
 */
export async function enviarIntentoQuiz(
  uid: string,
  quizId: string,
  respuestas: Record<string, string>, // preguntaId -> respuestaId
): Promise<IntentoQuiz> {
  if (!db) throw new Error('Firestore not initialized')

  try {
    // Aquí iría la lógica de cálculo de calificación
    // Por ahora, es un placeholder que requeriría verificación de respuestas correctas

    const calificacion = 0 // Será calculado por Cloud Function en producción
    const aprobado = calificacion >= 60

    const intentoRef = doc(collection(db, 'quizAttempts'))
    const intento: Omit<IntentoQuiz, 'id'> = {
      uid,
      quizId,
      respuestas,
      calificacion,
      aprobado,
      createdAt: new Date().toISOString(),
    }

    await setDoc(intentoRef, intento)

    return { ...intento, id: intentoRef.id }
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    throw error
  }
}

/**
 * Obtiene los intentos de quiz de un campista
 */
export async function getIntentosCampista(uid: string): Promise<IntentoQuiz[]> {
  if (!db) return []

  try {
    const snap = await getDocs(query(collection(db, 'quizAttempts'), where('uid', '==', uid)))
    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as IntentoQuiz))
  } catch (error) {
    console.error('Error fetching campista quiz attempts:', error)
    return []
  }
}
