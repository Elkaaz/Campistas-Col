import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
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
    avatarUrl: profile.avatarUrl || '',
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

export async function loginWithGoogle(): Promise<User | null> {
  if (!auth || !db) return null

  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  const profileRef = doc(db, 'profiles', user.uid)
  const profileSnap = await getDoc(profileRef)

  if (!profileSnap.exists()) {
    const newProfile: CampistaProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Campista Google',
      email: user.email || '',
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      avatarUrl: user.photoURL || '',
      role: 'campista',
      departamento: '',
      municipio: '',
      nivelActual: 'semilla',
      xpTotal: 0,
      perfilCompleto: false,
      createdAt: new Date().toISOString(),
    }

    await setDoc(profileRef, newProfile)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'campista',
      createdAt: new Date().toISOString(),
    })
  }

  return user
}

export async function logoutUser(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}
