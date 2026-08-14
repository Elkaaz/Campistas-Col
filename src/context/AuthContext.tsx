import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, demoMode } from '../firebase'
import { loginUser, logoutUser } from '../services/authService'
import { profileService } from '../services'
import { demoStore } from '../data/demoStore'
import type { User } from '../types'

type AuthContextValue = {
  /** Perfil del campista en sesión (o el campista demo). */
  profile: User | null
  loading: boolean
  demoMode: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<User | null>(demoMode ? demoStore.currentUser : null)
  const [loading, setLoading] = useState(!demoMode)

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setProfile(firebaseUser ? await profileService.getProfileByUid(firebaseUser.uid) : null)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      loading,
      demoMode,
      isAuthenticated: demoMode || Boolean(profile),
      async login(email: string, password: string) {
        if (demoMode) {
          setProfile(demoStore.currentUser)
          return
        }
        await loginUser(email, password)
      },
      async logout() {
        if (demoMode) return
        await logoutUser()
        setProfile(null)
      },
      async refreshProfile() {
        if (demoMode) {
          setProfile({ ...demoStore.currentUser })
          return
        }
        if (profile) setProfile(await profileService.getProfileByUid(profile.uid))
      },
    }),
    [profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
