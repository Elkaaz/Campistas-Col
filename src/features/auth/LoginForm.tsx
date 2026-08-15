import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await loginUser(email, password)
      if (user) {
        navigate('/', { replace: true })
      }
    } catch (err: any) {
      console.error('[LoginForm]', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos')
      } else if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intenta mas tarde')
      } else {
        setError('Error al iniciar sesion. Intenta de nuevo')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#fca5a5',
          fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}

      <label>
        Correo
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="campista@campistascol.com"
          required
          disabled={loading}
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          disabled={loading}
          minLength={6}
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Entrar al campamento 🏕️'}
      </button>
    </form>
  )
}
