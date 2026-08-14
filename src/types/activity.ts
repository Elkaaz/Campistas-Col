export type ActivityTipo = 
  | 'cartilla_completada' 
  | 'reto_publicado' 
  | 'reto_validado' 
  | 'nivel_subido' 
  | 'quiz_completado' 
  | 'interaccion_fogata' 
  | 'interaccion_nudo'
  | 'login'

export interface Actividad {
  actividadId: string
  
  // USUARIO
  uid: string
  usuarioNombre: string
  usuarioAvatar?: string
  
  // TIPO DE ACTIVIDAD
  tipo: ActivityTipo
  descripcion: string
  
  // METADATOS
  metadatos?: {
    cartillaId?: string
    cartillaNombre?: string
    retoId?: string
    retoNombre?: string
    xpGanado?: number
    nivelAnterior?: string
    nivelNuevo?: string
  }
  
  // TIMESTAMPS
  createdAt: Date
  diasAtras?: number
  mes?: string
}
