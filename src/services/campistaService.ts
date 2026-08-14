import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { CampistaProfile } from '../types'

const ensureDb = () => {
  if (!db) {
    throw new Error('Firebase Firestore no está configurado')
  }
  return db
}

export async function getProfile(uid: string) {
  const profileRef = doc(ensureDb(), 'profiles', uid)
  const snap = await getDoc(profileRef)
  return snap.exists() ? (snap.data() as CampistaProfile) : null
}

export async function createProfile(profile: CampistaProfile) {
  const profileRef = doc(ensureDb(), 'profiles', profile.uid)
  await setDoc(profileRef, profile)
  return profile
}

export async function updateProfile(uid: string, updates: Partial<CampistaProfile>) {
  const profileRef = doc(ensureDb(), 'profiles', uid)
  await updateDoc(profileRef, updates)
}

export async function getLevels() {
  const levelsRef = collection(ensureDb(), 'levels')
  return levelsRef
}
