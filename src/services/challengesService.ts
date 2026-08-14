export type Challenge = {
  id: string
  title: string
  xp: number
  status: 'pendiente' | 'validado' | 'activo'
}

export const mockChallenges: Challenge[] = [
  { id: '1', title: 'Fogata segura', xp: 80, status: 'pendiente' },
  { id: '2', title: 'Nudo de seguridad', xp: 60, status: 'validado' },
  { id: '3', title: 'Cartilla de convivencia', xp: 50, status: 'activo' },
]
