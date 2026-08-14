import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { CampistaProfile } from '../types'

export async function registerUser(email: string, password: string, profile: Partial<CampistaProfile>): Promise<User | null> {
  if (!auth || !db) return null

  const result = await createUserWithEmailAndPassword(auth, email, password)

  const userProfile: CampistaProfile = {
    uid: result.user.uid,
    displayName: profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    email: result.user.email || email,
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    role: profile.role || 'campista',
    departamento: profile.departamento || '',
    municipio: profile.municipio || '',
    nivelActual: profile.nivelActual || 'aspirante',
    xpTotal: profile.xpTotal || 0,
    perfilCompleto: profile.perfilCompleto || false,
    createdAt: new Date().toISOString(),
  }

  await setDoc(doc(db, 'profiles', result.user.uid), userProfile)
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    email: result.user.email,
    role: userProfile.role,
    createdAt: new Date().toISOString(),
  })

  return result.user
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  if (!auth) return null

  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logoutUser(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}
