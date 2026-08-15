export type ServicioTipo = 
  | 'reforestacion'
  | 'brigada_salud'
  | 'taller_formacion'
  | 'campamento'
  | 'jornada_comunitaria'
  | 'otro'

export interface Servicio {
  servicioId: string
  uid: string
  tipo: ServicioTipo
  titulo: string
  descripcion: string
  fecha: Date
  horas: number
  ubicacion: string
  departamento: string
  municipio: string
  validadoPor?: string
  validadorNombre?: string
  estado: 'pendiente' | 'validado' | 'rechazado'
  comentarioValidacion?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateServicioInput {
  tipo: ServicioTipo
  titulo: string
  descripcion: string
  fecha: Date
  horas: number
  ubicacion: string
  departamento: string
  municipio: string
}
