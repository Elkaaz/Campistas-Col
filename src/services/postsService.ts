import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Post, RetoTipo, CreatePostInput } from '../types'

/**
 * Servicios para posts (publicaciones de retos)
 */
export const postsService = {
  /**
   * Obtener feed social (posts validados) - con real-time listener
   */
  subscribeFeedSocial(callback: (posts: Post[]) => void, limitNum = 20): Unsubscribe {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'validado'),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          postId: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Post))
        callback(posts)
      })
    } catch (error) {
      console.error('Error subscribing to feed:', error)
      return () => {}
    }
  },

  /**
   * Obtener posts por tipo de reto - con real-time listener
   */
  subscribePostsByType(type: RetoTipo, callback: (posts: Post[]) => void, limitNum = 20): Unsubscribe {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'validado'),
        where('retoTipo', '==', type),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          postId: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Post))
        callback(posts)
      })
    } catch (error) {
      console.error('Error subscribing to posts by type:', error)
      return () => {}
    }
  },

  /**
   * Obtener posts pendientes de validación (para líderes) - con real-time listener
   */
  subscribePendingPosts(callback: (posts: Post[]) => void, limitNum = 50): Unsubscribe {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'pendiente_validacion'),
        orderBy('createdAt', 'asc'),
        limit(limitNum)
      )
      return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          postId: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Post))
        callback(posts)
      })
    } catch (error) {
      console.error('Error subscribing to pending posts:', error)
      return () => {}
    }
  },

  /**
   * Legacy: Obtener feed social (posts validados) - one-time
   */
  async getFeedSocial(limitNum = 20): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'validado'),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Post))
    } catch (error) {
      console.error('Error getting feed:', error)
      return []
    }
  },

  /**
   * Legacy: Obtener posts por tipo de reto - one-time
   */
  async getPostsByType(type: RetoTipo, limitNum = 20): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'validado'),
        where('retoTipo', '==', type),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Post))
    } catch (error) {
      console.error('Error getting posts by type:', error)
      return []
    }
  },

  /**
   * Legacy: Obtener posts pendientes de validación (para líderes) - one-time
   */
  async getPendingPosts(limitNum = 50): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('estado', '==', 'pendiente_validacion'),
        orderBy('createdAt', 'asc'),
        limit(limitNum)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Post))
    } catch (error) {
      console.error('Error getting pending posts:', error)
      return []
    }
  },

  /**
   * Crear un nuevo post
   */
  async createPost(
    uid: string,
    autoresNombre: string,
    autoresAvatar: string | undefined,
    autoresNivel: string,
    autoresNivelColor: string,
    retoData: CreatePostInput,
    municipio: string,
    departamento: string
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        uid,
        autoresNombre,
        autoresAvatar,
        autoresNivel,
        autoresNivelColor,
        retoId: retoData.retoId,
        retoTitulo: retoData.retoTitulo,
        retoTipo: retoData.retoTipo,
        titulo: retoData.titulo,
        descripcion: retoData.descripcion,
        imagenes: retoData.imagenes,
        estado: 'pendiente_validacion',
        xpAsignado: retoData.xpAsignado,
        contadorFogatas: 0,
        contadorNudos: 0,
        contadorComentarios: 0,
        municipio,
        departamento,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  /**
   * Validar un post (solo líderes)
   */
  async validatePost(
    postId: string,
    validadorUid: string,
    validadorNombre: string,
    xpAsignado: number,
    comentario?: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        estado: 'validado',
        validadorUid,
        validadorNombre,
        xpAsignado,
        comentarioValidacion: comentario || '',
        fechaValidacion: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error validating post:', error)
      throw error
    }
  },

  /**
   * Rechazar un post
   */
  async rejectPost(
    postId: string,
    validadorUid: string,
    validadorNombre: string,
    comentario: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        estado: 'rechazado',
        validadorUid,
        validadorNombre,
        comentarioValidacion: comentario,
        fechaValidacion: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error rejecting post:', error)
      throw error
    }
  },
}
