export type LevelId = 'semilla' | 'raiz' | 'tallo' | 'hoja' | 'flor' | 'fruto'

export interface Level {
  id: LevelId
  orden: number
  nombre: string
  descripcion: string
  color: string
  colorSecundario: string
  icono: string
  xpRequerida: number
  xpParaSiguiente: number
  cartillasDesbloqueadas?: string[]
  createdAt?: Date
}

export interface LevelProgress {
  nivelActual: LevelId
  xpTotal: number
  xpParaSiguiente: number
  porcentajeProgreso: number
  proximoNivel?: LevelId
}
