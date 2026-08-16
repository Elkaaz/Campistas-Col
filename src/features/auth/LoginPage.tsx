import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthPage from './AuthPage'

/**
 * LoginPage - Página de autenticación
 * Redirecciona a AuthPage que maneja login y registro
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') as 'login' | 'register' | null

  // Si viene desde navbar con ?mode=login o ?mode=register, muestra ese modo
  // Si no, muestra AuthPage que defaultea a login

  return <AuthPage initialMode={mode || 'login'} />
}
