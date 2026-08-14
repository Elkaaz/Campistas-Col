export type InteractionTipo = 'fogata' | 'nudo'

export interface Interaction {
  interactionId: string
  
  // USUARIO QUE REACCIONA
  uid: string
  usuarioNombre: string
  usuarioAvatar?: string
  
  // POST OBJETIVO
  postId: string
  
  // TIPO DE REACCIÓN
  tipo: InteractionTipo
  
  // TIMESTAMPS
  createdAt: Date
}

export interface CreateInteractionInput {
  uid: string
  usuarioNombre: string
  usuarioAvatar?: string
  postId: string
  tipo: InteractionTipo
}
