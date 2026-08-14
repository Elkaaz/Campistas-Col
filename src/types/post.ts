export type RetoTipo = 'nudo' | 'refugio' | 'fogata' | 'huerta' | 'primeros_auxilios'
export type PostEstado = 'pendiente_validacion' | 'validado' | 'rechazado'

export interface Post {
  postId: string
  
  // AUTOR
  uid: string
  autoresNombre: string
  autoresAvatar?: string
  autoresNivel: string
  autoresNivelColor: string
  
  // RETO
  retoId: string
  retoTitulo: string
  retoTipo: RetoTipo
  
  // CONTENIDO
  titulo: string
  descripcion: string
  imagenes: string[] // URLs de Cloudinary o Firebase Storage
  
  // VALIDACIÓN
  estado: PostEstado
  validadorUid?: string
  validadorNombre?: string
  fechaValidacion?: Date
  comentarioValidacion?: string
  
  // RECOMPENSA
  xpAsignado: number
  
  // ESTADÍSTICAS
  contadorFogatas: number
  contadorNudos: number
  contadorComentarios: number
  
  // UBICACIÓN
  municipio: string
  departamento: string
  
  // TAGS
  tags?: string[]
  
  // TIMESTAMPS
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostInput {
  retoId: string
  retoTitulo: string
  retoTipo: RetoTipo
  titulo: string
  descripcion: string
  imagenes: string[]
  xpAsignado: number
}
