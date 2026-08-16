export type UserRole = 'campista' | 'lider_bosque' | 'comite_departamental' | 'admin'

export type CampistaProfile = {
  uid: string
  displayName: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  departamento: string
  municipio: string
  nivelActual: string
  xpTotal: number
  perfilCompleto: boolean
  tipoSangre?: string
  eps?: string
  alergias?: string
  contactoEmergencia?: {
    nombre: string
    telefono: string
    parentesco: string
  }
  avatarUrl?: string
  bio?: string
  createdAt?: string
}
// Types for Cartilla Detail Page
export type CartillaProgresoDetail = {
  uid: string
  cartillaId: string
  completada: boolean
  fechaCompletado?: Date
  porcentajeLeido: number
  tiempoDedicado: number // in minutes
  quizResultado?: number // 0-100 score
  xpGanado?: number
  badgeOtorgado?: string
  createdAt: Date
  updatedAt: Date
}

export type QuizQuestion = {
  id: string
  cartillaId: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number // index of correct answer
  explicacion: string
  puntos: number
  dificultad: 'facil' | 'medio' | 'dificil'
}

export type Badge = {
  id: string
  nombre: string
  descripcion: string
  icono: string
  colorTema: string
  requeridoPara: string
  criterios: {
    cartillaId?: string
    quizScore?: number
    xpMinimo?: number
    nivelMinimo?: string
  }
  rarity: 'comun' | 'raro' | 'epico' | 'legendario'
  createdAt: Date
}