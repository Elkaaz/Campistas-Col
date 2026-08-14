export type UserRole = 'campista' | 'lider_bosque' | 'comite_departamental' | 'admin'
export type NivelActual = 'semilla' | 'raiz' | 'tallo' | 'hoja' | 'flor' | 'fruto'

export interface User {
  uid: string
  displayName: string
  email: string
  avatar?: string
  
  // GAMIFICACIÓN
  xpTotal: number
  nivelActual: NivelActual
  nivelOrden: number
  
  // UBICACIÓN TERRITORIAL
  departamento: string
  municipio: string
  nombreBosque: string
  
  // DATOS MÉDICOS
  tipoSangre: string
  eps: string
  alergias?: string
  telefonoEmergencia?: string
  
  // IDENTIFICACIÓN
  tipoDocumento?: string
  documento?: string
  fechaNacimiento?: Date
  
  // JERARQUÍA
  rol: UserRole
  esLider: boolean
  esComiteDeptal: boolean
  
  // SOCIAL
  biografia?: string
  habilidadEspecial?: string
  seguidores?: number
  siguiendo?: number
  
  // ESTADÍSTICAS
  cartillasCompletadas: number
  cartillasTotal: number
  quizzesCompletados: number
  quizzesTotal: number
  retosPublicados: number
  retosValidados: number
  
  // ESTADO
  perfilCompleto: boolean
  activo: boolean
  
  // TIMESTAMPS
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends Omit<User, 'uid'> {
  uid: string
}
