import { collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '../firebase'
import type { CampistaProfile } from '../types'

/**
 * Obtiene el perfil completo de un campista
 */
export async function getCampistaProfile(uid: string): Promise<CampistaProfile | null> {
  if (!db) return null

  try {
    const ref = doc(db, 'profiles', uid)
    const snap = await getDocs(query(collection(db, 'profiles'), where('uid', '==', uid)))

    if (snap.empty) return null
    return snap.docs[0].data() as CampistaProfile
  } catch (error) {
    console.error('Error fetching campista profile:', error)
    return null
  }
}

/**
 * Actualiza el perfil del campista con información médica y de emergencia
 */
export async function updateCampistaProfile(
  uid: string,
  updates: Partial<CampistaProfile>,
): Promise<void> {
  if (!db) return

  try {
    const ref = doc(db, 'profiles', uid)
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating campista profile:', error)
    throw error
  }
}

/**
 * Completa el perfil del campista después del registro
 */
export async function completeCampistaProfile(
  uid: string,
  profileData: Partial<CampistaProfile>,
): Promise<void> {
  if (!db) return

  try {
    const ref = doc(db, 'profiles', uid)
    await updateDoc(ref, {
      ...profileData,
      perfilCompleto: true,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error completing profile:', error)
    throw error
  }
}

/**
 * Obtiene todos los campistas de un departamento
 */
export async function getCampistasByDepartamento(
  departamento: string,
): Promise<CampistaProfile[]> {
  if (!db) return []

  try {
    const q = query(collection(db, 'profiles'), where('departamento', '==', departamento))
    const snap = await getDocs(q)
    return snap.docs.map((doc) => doc.data() as CampistaProfile)
  } catch (error) {
    console.error('Error fetching campistas by department:', error)
    return []
  }
}

/**
 * Obtiene campistas activos (perfil completo y registrados en últimos 30 días)
 */
export async function getActiveCampistas(): Promise<CampistaProfile[]> {
  if (!db) return []

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const q = query(
      collection(db, 'profiles'),
      where('perfilCompleto', '==', true),
      where('createdAt', '>=', thirtyDaysAgo),
    )

    const snap = await getDocs(q)
    return snap.docs.map((doc) => doc.data() as CampistaProfile)
  } catch (error) {
    console.error('Error fetching active campistas:', error)
    return []
  }
}
