export type EventoTipo = 'campamento' | 'jornada' | 'taller' | 'brigada' | 'reunion' | 'otro'
export type EventoEstado = 'proximo' | 'inscripciones_abiertas' | 'inscripciones_cerradas' | 'finalizado' | 'cancelado'

export interface Evento {
  eventoId: string
  titulo: string
  descripcion: string
  tipo: EventoTipo
  estado: EventoEstado
  fechaInicio: Date
  fechaFin: Date
  horaInicio?: string
  horaFin?: string
  ubicacion: string
  departamento: string
  municipio: string
  cupos: number
  inscritos: number
  imagenUrl?: string
  organizador: string
  esVirtual: boolean
  linkVirtual?: string
  requisitos?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface InscripcionEvento {
  inscripcionId: string
  eventoId: string
  uid: string
  nombreCampista: string
  email: string
  telefono?: string
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  createdAt: Date
}
