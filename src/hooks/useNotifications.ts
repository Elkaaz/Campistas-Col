import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { CampistaProfile } from '../types'
import { notificationsService } from '../services/notificationsService'
import type { Notification } from '../types'

export interface AuthState {
  user: User | null
  profile: CampistaProfile | null
  loading: boolean
  isAuthenticated: boolean
}

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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async (uid: string) => {
    try {
      const [all, unread] = await Promise.all([
        notificationsService.getNotifications(uid, 50),
        notificationsService.getUnreadNotifications(uid),
      ])
      setNotifications(all)
      setUnreadCount(unread.length)
    } catch (e) {
      console.error('Error loading notifications:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationsService.markAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n => n.notificationId === notificationId ? { ...n, leido: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async (uid: string) => {
    await notificationsService.markAllAsRead(uid)
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })))
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  }
}
