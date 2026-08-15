import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { CampistaProfile } from '../types'

export interface AuthState {
  user: User | null
  profile: CampistaProfile | null
  loading: boolean
  isAuthenticated: boolean
}

/**
 * useAuth — Hook global de autenticacion
 * Escucha el estado de Firebase Auth y carga el perfil de Firestore.
 * Usar en componentes que necesiten saber quien esta logueado.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<CampistaProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser && db) {
        try {
          const snap = await getDoc(doc(db, 'profiles', firebaseUser.uid))
          if (snap.exists()) {
            setProfile(snap.data() as CampistaProfile)
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('[useAuth] Error cargando perfil:', err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  }
}
