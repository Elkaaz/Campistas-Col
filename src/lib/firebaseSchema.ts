export const FIREBASE_COLLECTIONS = {
  users: 'users',
  profiles: 'profiles',
  departments: 'departments',
  municipalities: 'municipalities',
  levels: 'levels',
  cartillas: 'cartillas',
  progresoCartillas: 'progresoCartillas',
  categoriesQuiz: 'categoriesQuiz',
  preguntas: 'preguntas',
  respuestas: 'respuestas',
  quizAttempts: 'quizAttempts',
  retos: 'retos',
  publicacionesRetos: 'publicacionesRetos',
  validaciones: 'validaciones',
  interacciones: 'interacciones',
  logsActividad: 'logsActividad',
  leaderboard: 'leaderboard',
} as const

export const USER_ROLES = {
  CAMPISTA: 'campista',
  LIDER_BOSQUE: 'lider_bosque',
  COMITE_DEPARTAMENTAL: 'comite_departamental',
  ADMIN: 'admin',
} as const

export const LEVELS_SEED = [
  { id: 'aspirante', name: 'Aspirante', minXp: 0, color: '#9ca3af' },
  { id: 'semilla', name: 'Semilla', minXp: 100, color: '#84cc16' },
  { id: 'raiz', name: 'Raíz', minXp: 300, color: '#8b5e3c' },
  { id: 'tallo', name: 'Tallo', minXp: 600, color: '#22c55e' },
  { id: 'hoja', name: 'Hoja', minXp: 1000, color: '#84cc16' },
  { id: 'flor', name: 'Flor', minXp: 1500, color: '#f59e0b' },
  { id: 'fruto', name: 'Fruto', minXp: 2500, color: '#ef4444' },
]
