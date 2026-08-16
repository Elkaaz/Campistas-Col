import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Notification, CreateNotificationInput } from '../types'

export const notificationsService = {
  /**
   * Subscribe to notifications in real-time
   */
  subscribeNotifications(uid: string, callback: (notifications: Notification[]) => void, limitNum = 50): Unsubscribe {
    if (!db) return () => {}
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
          ...doc.data(),
          notificationId: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Notification))
        callback(notifications)
      })
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      return () => {}
    }
  },

  /**
   * Subscribe to unread notifications in real-time
   */
  subscribeUnreadNotifications(uid: string, callback: (notifications: Notification[]) => void): Unsubscribe {
    if (!db) return () => {}
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('leido', '==', false),
        orderBy('createdAt', 'desc')
      )
      return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
          ...doc.data(),
          notificationId: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Notification))
        callback(notifications)
      })
    } catch (error) {
      console.error('Error subscribing to unread notifications:', error)
      return () => {}
    }
  },

  /**
   * Legacy: Get notifications one-time
   */
  async getNotifications(uid: string, limitNum = 50): Promise<Notification[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        notificationId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Notification))
    } catch (error) {
      console.error('Error getting notifications:', error)
      return []
    }
  },

  /**
   * Legacy: Get unread notifications one-time
   */
  async getUnreadNotifications(uid: string): Promise<Notification[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('leido', '==', false),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        notificationId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Notification))
    } catch (error) {
      console.error('Error getting unread notifications:', error)
      return []
    }
  },

  async createNotification(input: CreateNotificationInput): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        uid: input.uid,
        tipo: input.tipo,
        titulo: input.titulo,
        mensaje: input.mensaje,
        referenciaId: input.referenciaId || '',
        leido: false,
        createdAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (!db) return
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        leido: true,
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  async markAllAsRead(uid: string): Promise<void> {
    if (!db) return
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        where('leido', '==', false)
      )
      const snapshot = await getDocs(q)
      const batch = snapshot.docs.map(docSnap =>
        updateDoc(docSnap.ref, { leido: true })
      )
      await Promise.all(batch)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    if (!db) return
    try {
      await deleteDoc(doc(db, 'notifications', notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },
}
