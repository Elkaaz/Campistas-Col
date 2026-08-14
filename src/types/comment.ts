export interface Comment {
  commentId: string
  
  // POST OBJETIVO
  postId: string
  
  // AUTOR
  uid: string
  usuarioNombre: string
  usuarioAvatar?: string
  usuarioNivel?: string
  
  // CONTENIDO
  texto: string
  
  // ESTADÍSTICAS
  likes: number
  
  // TIMESTAMPS
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentInput {
  postId: string
  uid: string
  usuarioNombre: string
  usuarioAvatar?: string
  usuarioNivel?: string
  texto: string
}
