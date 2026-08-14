export interface Municipio {
  municipioId: string
  
  // UBICACIÓN
  nombre: string
  departamento: string
  
  // RED SOCIAL LOCAL
  bosqueNombre: string
  bosqueDescripcion?: string
  
  // ESTADÍSTICAS
  campistasTotal: number
  lideresTotal: number
  
  // OPCIONAL
  coordenadas?: {
    latitud: number
    longitud: number
  }
  
  // METADATA
  createdAt: Date
}

export interface MunicipioWithStats extends Municipio {
  xpPromedio?: number
  nivelPromedio?: string
}
