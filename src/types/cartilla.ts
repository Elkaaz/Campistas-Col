export interface Cartilla {
  cartillaId: string
  
  // METADATA
  nombre: string
  slug: string
  descripcion: string
  
  // CONTENIDO
  contenido: string // HTML o markdown compilado
  archivoPdf?: string // URL
  
  // CLASIFICACIÓN
  nivel: string // Nivel requerido
  categoria: string
  
  // VISUAL
  icono: string // Emoji
  colorTema: string
  imagenPortada?: string
  
  // ORGANIZACIÓN
  orden: number
  seccion: string
  
  // ESTADÍSTICAS
  competidosTotal: number
  
  // PROGRESIÓN
  xpAlCompletar: number
  insigniaOtorgada?: string
  nivelMinimo: string
  requisitosPrevios?: string[] // ids de cartillas requeridas
  
  // METADATA
  creadoPor: string
  createdAt: Date
  updatedAt: Date
}

export interface CartillaProgreso {
  uid: string
  cartillaId: string
  completada: boolean
  porcentajeLeido: number
  fechaInicio: Date
  fechaCompletacion?: Date
  tiempoDedicado: number // segundos
}

export interface CartillaWithProgress extends Cartilla {
  usuarioProgreso?: CartillaProgreso
  desbloqueada: boolean
}
