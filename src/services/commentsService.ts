import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Comment, CreateCommentInput } from '../types'

export const commentsService = {
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        commentId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Comment))
    } catch (error) {
      console.error('Error getting comments:', error)
      return []
    }
  },

  async createComment(input: CreateCommentInput): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        postId: input.postId,
        uid: input.uid,
        usuarioNombre: input.usuarioNombre,
        usuarioAvatar: input.usuarioAvatar || '',
        usuarioNivel: input.usuarioNivel || '',
        texto: input.texto,
        likes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    if (!db) return
    try {
      await deleteDoc(doc(db, 'comments', commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  async likeComment(commentId: string): Promise<void> {
    if (!db) return
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        likes: increment(1),
      })
    } catch (error) {
      console.error('Error liking comment:', error)
      throw error
    }
  },

  async unlikeComment(commentId: string): Promise<void> {
    if (!db) return
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        likes: increment(-1),
      })
    } catch (error) {
      console.error('Error unliking comment:', error)
      throw error
    }
  },
}
