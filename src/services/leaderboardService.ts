export type LeaderboardEntry = {
  name: string
  xp: number
  level: string
  department: string
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { name: 'Ana Gómez', xp: 2450, level: 'Fruto', department: 'Antioquia' },
  { name: 'Mateo Rojas', xp: 2100, level: 'Flor', department: 'Bogotá' },
  { name: 'Valeria Ariza', xp: 1900, level: 'Hoja', department: 'Valle del Cauca' },
  { name: 'Santiago Peña', xp: 1700, level: 'Tallo', department: 'Boyacá' },
]
