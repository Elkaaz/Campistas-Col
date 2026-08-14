import type { Interaction, InteractionTipo, Post, Reto, User } from '../types'
import {
  DEMO_CURRENT_USER,
  DEMO_INTERACTIONS,
  DEMO_POSTS,
  DEMO_RETOS,
  DEMO_USERS,
} from './demoData'

/**
 * Estado en memoria del modo demo.
 *
 * Permite que el prototipo sea interactivo (reaccionar, publicar retos)
 * sin necesidad de un backend. Se reinicia al recargar la página.
 */

const posts: Post[] = DEMO_POSTS.map((post) => ({ ...post }))
const users: User[] = DEMO_USERS.map((user) => ({ ...user }))
const retos: Reto[] = DEMO_RETOS.map((reto) => ({ ...reto }))
const interactions: Interaction[] = DEMO_INTERACTIONS.map((interaction) => ({ ...interaction }))

export const demoStore = {
  getPosts(): Post[] {
    return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getPostsByType(tipo: Post['retoTipo']): Post[] {
    return demoStore.getPosts().filter((post) => post.retoTipo === tipo)
  },

  getPostsByUid(uid: string): Post[] {
    return demoStore.getPosts().filter((post) => post.uid === uid)
  },

  addPost(post: Post): string {
    posts.unshift(post)
    return post.postId
  },

  getUsers(): User[] {
    return [...users].sort((a, b) => b.xpTotal - a.xpTotal)
  },

  getUsersByMunicipio(municipio: string): User[] {
    return demoStore.getUsers().filter((user) => user.municipio === municipio)
  },

  getUser(uid: string): User | null {
    return users.find((user) => user.uid === uid) ?? null
  },

  getRetos(): Reto[] {
    return [...retos]
  },

  getInteractions(postId: string): Interaction[] {
    return interactions.filter((interaction) => interaction.postId === postId)
  },

  hasInteraction(uid: string, postId: string, tipo: InteractionTipo): boolean {
    return interactions.some(
      (interaction) =>
        interaction.uid === uid && interaction.postId === postId && interaction.tipo === tipo,
    )
  },

  toggleInteraction(uid: string, usuarioNombre: string, postId: string, tipo: InteractionTipo): void {
    const post = posts.find((item) => item.postId === postId)
    if (!post) return

    const field = tipo === 'fogata' ? 'contadorFogatas' : 'contadorNudos'
    const index = interactions.findIndex(
      (interaction) =>
        interaction.uid === uid && interaction.postId === postId && interaction.tipo === tipo,
    )

    if (index >= 0) {
      interactions.splice(index, 1)
      post[field] = Math.max(0, post[field] - 1)
      return
    }

    interactions.push({
      interactionId: `int_${Date.now()}`,
      uid,
      usuarioNombre,
      postId,
      tipo,
      createdAt: new Date(),
    })
    post[field] += 1
  },

  addXp(uid: string, amount: number): void {
    const user = users.find((item) => item.uid === uid)
    if (user) user.xpTotal += amount
  },

  get currentUser(): User {
    return demoStore.getUser(DEMO_CURRENT_USER.uid) ?? DEMO_CURRENT_USER
  },
}
