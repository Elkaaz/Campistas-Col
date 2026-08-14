import { Level, NivelActual } from '../types'

// NIVELES DEL SISTEMA
export const LEVELS: Record<NivelActual, Level> = {
  semilla: {
    id: 'semilla',
    orden: 1,
    nombre: 'Semilla',
    descripcion: 'Aspirante nuevo, recién iniciando su camino campista',
    color: '#8B7355',
    colorSecundario: '#D2B48C',
    icono: '🌱',
    xpRequerida: 0,
    xpParaSiguiente: 500,
  },
  raiz: {
    id: 'raiz',
    orden: 2,
    nombre: 'Raíz',
    descripcion: 'Consolidando tu base campista',
    color: '#654321',
    colorSecundario: '#8B7355',
    icono: '🪴',
    xpRequerida: 500,
    xpParaSiguiente: 1500,
  },
  tallo: {
    id: 'tallo',
    orden: 3,
    nombre: 'Tallo',
    descripcion: 'Creciendo constantemente en habilidades',
    color: '#228B22',
    colorSecundario: '#32CD32',
    icono: '🌿',
    xpRequerida: 1500,
    xpParaSiguiente: 3500,
  },
  hoja: {
    id: 'hoja',
    orden: 4,
    nombre: 'Hoja',
    descripcion: 'Expandiendo tus capacidades campistas',
    color: '#32CD32',
    colorSecundario: '#7FFF00',
    icono: '🍃',
    xpRequerida: 3500,
    xpParaSiguiente: 7500,
  },
  flor: {
    id: 'flor',
    orden: 5,
    nombre: 'Flor',
    descripcion: 'Floreciendo en madurez y liderazgo',
    color: '#FF69B4',
    colorSecundario: '#FFB6C1',
    icono: '🌸',
    xpRequerida: 7500,
    xpParaSiguiente: 15000,
  },
  fruto: {
    id: 'fruto',
    orden: 6,
    nombre: 'Fruto',
    descripcion: 'Máximo nivel de excelencia campista',
    color: '#FF4500',
    colorSecundario: '#FFD700',
    icono: '🍎',
    xpRequerida: 15000,
    xpParaSiguiente: 999999,
  },
}

// TIPOS DE RETOS
export const RETO_TYPES = {
  nudo: { icon: '🪢', label: 'Nudo', color: '#8B4513', description: 'Técnicas de nudos y amarres' },
  refugio: { icon: '🏕️', label: 'Refugio', color: '#654321', description: 'Construcción y refugios' },
  fogata: { icon: '🔥', label: 'Fogata', color: '#FF4500', description: 'Fuego y seguridad' },
  huerta: { icon: '🌱', label: 'Huerta', color: '#228B22', description: 'Naturaleza y ambiente' },
  primeros_auxilios: { icon: '🚑', label: 'Primeros Auxilios', color: '#E74C3C', description: 'Salud y emergencias' },
} as const

// RUTAS PRINCIPALES
export const NAV_ITEMS = [
  { label: 'El Fogón 🔥', to: '/', icon: '🔥' },
  { label: 'Mi Bosque 🌳', to: '/bosque', icon: '🌳' },
  { label: 'Mi Aprendizaje 📚', to: '/cartillas', icon: '📚' },
  { label: 'Retos ⛰️', to: '/retos', icon: '⛰️' },
  { label: 'Niveles 🎖️', to: '/niveles', icon: '🎖️' },
  { label: 'Leaderboard 🏆', to: '/leaderboard', icon: '🏆' },
] as const

// HABILIDADES ESPECIALES
export const HABILIDADES_ESPECIALES = [
  'nudos',
  'fogatas',
  'expresión_cultural',
  'liderazgo',
  'naturaleza',
  'primeros_auxilios',
  'organización',
  'creatividad',
] as const

// DEPARTAMENTOS DE COLOMBIA
export const DEPARTAMENTOS = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
  'Distrito Capital',
] as const

// TIPOS DE DOCUMENTO
export const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'RC', label: 'Registro Civil' },
] as const

// TIPOS DE SANGRE
export const TIPOS_SANGRE = [
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
] as const

// ROLES
export const ROLES = {
  campista: 'Campista',
  lider_bosque: 'Líder de Bosque',
  comite_departamental: 'Comité Departamental',
  admin: 'Administrador',
} as const

// COLORES POR NIVEL (Mapa útil)
export const NIVEL_COLORS: Record<NivelActual, string> = {
  semilla: '#8B7355',
  raiz: '#654321',
  tallo: '#228B22',
  hoja: '#32CD32',
  flor: '#FF69B4',
  fruto: '#FF4500',
}

// EMOJIS ESPECIALES
export const EMOJIS = {
  fogata: '🔥',
  nudo: '🪢',
  nivel: '🎖️',
  xp: '⭐',
  lider: '👑',
  bosque: '🌳',
  fogon: '🔥',
  cartilla: '📚',
  quiz: '❓',
  reto: '⛰️',
  campista: '🏕️',
} as const
