import type { RetoTipo } from './post'

export type RetoEstado = 'activo' | 'inactivo' | 'archivado'

export interface Reto {
  retoId: string
  
  // INFORMACIÓN BÁSICA
  titulo: string
  descripcion: string
  tipo: RetoTipo
  nivelRecomendado: string
  xpRecompensa: number
  
  // DETALLES
  criteriosEvaluacion: string
  imagenReferencia?: string
  
  // ESTADO
  estado: RetoEstado
  
  // METADATA
  creadoPor: string
  createdAt: Date
  updatedAt: Date
}

export interface RetoWithProgress extends Reto {
  publicacionesTotal?: number
  publicacionesValidadas?: number
  usuarioPublico?: boolean
}
