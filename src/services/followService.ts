import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Follow {
  id: string
  followerUid: string
  followingUid: string
  createdAt: Date
}

export const followService = {
  async follow(followerUid: string, followingUid: string): Promise<void> {
    if (!db) return
    try {
      await addDoc(collection(db, 'follows'), {
        followerUid,
        followingUid,
        createdAt: Timestamp.now(),
      })
      await updateDoc(doc(db, 'profiles', followingUid), {
        seguidores: increment(1),
      })
    } catch (error) {
      console.error('Error following user:', error)
      throw error
    }
  },

  async unfollow(followerUid: string, followingUid: string): Promise<void> {
    if (!db) return
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerUid', '==', followerUid),
        where('followingUid', '==', followingUid)
      )
      const snapshot = await getDocs(q)
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(docSnapshot.ref)
      }
      await updateDoc(doc(db, 'profiles', followingUid), {
        seguidores: increment(-1),
      })
    } catch (error) {
      console.error('Error unfollowing user:', error)
      throw error
    }
  },

  async isFollowing(followerUid: string, followingUid: string): Promise<boolean> {
    if (!db) return false
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerUid', '==', followerUid),
        where('followingUid', '==', followingUid)
      )
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking follow status:', error)
      return false
    }
  },

  async getFollowers(uid: string): Promise<Follow[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'follows'),
        where('followingUid', '==', uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Follow))
    } catch (error) {
      console.error('Error getting followers:', error)
      return []
    }
  },

  async getFollowing(uid: string): Promise<Follow[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerUid', '==', uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Follow))
    } catch (error) {
      console.error('Error getting following:', error)
      return []
    }
  },
}
