import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { demoStore } from '../data/demoStore'
import { Post, RetoTipo, CreatePostInput } from '../types'

/**
 * Servicios para posts (publicaciones de retos)
 */
export const postsService = {
  /**
   * Obtener feed social (posts validados)
   */
  async getFeedSocial(limitNum = 20): Promise<Post[]> {
    if (!db) return demoStore.getPosts().slice(0, limitNum)

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
   * Obtener posts por tipo de reto
   */
  async getPostsByType(type: RetoTipo, limitNum = 20): Promise<Post[]> {
    if (!db) return demoStore.getPostsByType(type).slice(0, limitNum)

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
   * Obtener posts validados de un campista
   */
  async getPostsByUid(uid: string, limitNum = 20): Promise<Post[]> {
    if (!db) return demoStore.getPostsByUid(uid).slice(0, limitNum)

    try {
      const q = query(
        collection(db, 'posts'),
        where('uid', '==', uid),
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
      console.error('Error getting posts by uid:', error)
      return []
    }
  },

  /**
   * Obtener posts pendientes de validación (para líderes)
   */
  async getPendingPosts(limitNum = 50): Promise<Post[]> {
    if (!db) return []

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
    if (!db) {
      const postId = `post_${Date.now()}`
      demoStore.addPost({
        postId,
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
        estado: 'validado',
        xpAsignado: retoData.xpAsignado,
        contadorFogatas: 0,
        contadorNudos: 0,
        contadorComentarios: 0,
        municipio,
        departamento,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      demoStore.addXp(uid, retoData.xpAsignado)
      return postId
    }

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
    if (!db) return

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
    if (!db) return

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
