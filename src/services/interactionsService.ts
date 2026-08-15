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
import { Interaction, InteractionTipo } from '../types'

/**
 * Servicios para interacciones (Fogatas 🔥 y Nudos 🪢)
 */
export const interactionsService = {
  /**
   * Agregar una interacción (fogata o nudo)
   */
  async addInteraction(
    uid: string,
    usuarioNombre: string,
    usuarioAvatar: string | undefined,
    postId: string,
    tipo: InteractionTipo
  ): Promise<void> {
    try {
      // Verificar si ya existe esta interacción
      const q = query(
        collection(db, 'interacciones'),
        where('uid', '==', uid),
        where('postId', '==', postId),
        where('tipo', '==', tipo)
      )
      const existing = await getDocs(q)

      if (existing.empty) {
        // Agregar nueva interacción
        await addDoc(collection(db, 'interacciones'), {
          uid,
          usuarioNombre,
          usuarioAvatar,
          postId,
          tipo,
          createdAt: Timestamp.now(),
        })

        // Incrementar contador en post
        const fieldName =
          tipo === 'fogata' ? 'contadorFogatas' : 'contadorNudos'
        await updateDoc(doc(db, 'posts', postId), {
          [fieldName]: increment(1),
        })
      }
    } catch (error) {
      console.error('Error adding interaction:', error)
      throw error
    }
  },

  /**
   * Remover una interacción
   */
  async removeInteraction(
    uid: string,
    postId: string,
    tipo: InteractionTipo
  ): Promise<void> {
    try {
      // Encontrar y eliminar la interacción
      const q = query(
        collection(db, 'interacciones'),
        where('uid', '==', uid),
        where('postId', '==', postId),
        where('tipo', '==', tipo)
      )
      const snapshot = await getDocs(q)

      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(docSnapshot.ref)
      }

      // Decrementar contador en post
      const fieldName =
        tipo === 'fogata' ? 'contadorFogatas' : 'contadorNudos'
      await updateDoc(doc(db, 'posts', postId), {
        [fieldName]: increment(-1),
      })
    } catch (error) {
      console.error('Error removing interaction:', error)
      throw error
    }
  },

  /**
   * Obtener todas las interacciones de un usuario
   */
  async getUserInteractions(uid: string): Promise<Interaction[]> {
    try {
      const q = query(
        collection(db, 'interacciones'),
        where('uid', '==', uid)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        interactionId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Interaction))
    } catch (error) {
      console.error('Error getting user interactions:', error)
      return []
    }
  },

  /**
   * Obtener interacciones de un post
   */
  async getPostInteractions(postId: string): Promise<Interaction[]> {
    try {
      const q = query(
        collection(db, 'interacciones'),
        where('postId', '==', postId)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        interactionId: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Interaction))
    } catch (error) {
      console.error('Error getting post interactions:', error)
      return []
    }
  },

  /**
   * Verificar si usuario ya dio reacción
   */
  async hasUserReacted(
    uid: string,
    postId: string,
    tipo: InteractionTipo
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'interacciones'),
        where('uid', '==', uid),
        where('postId', '==', postId),
        where('tipo', '==', tipo)
      )
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking user reaction:', error)
      return false
    }
  },
}
