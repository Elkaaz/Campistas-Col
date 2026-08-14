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
