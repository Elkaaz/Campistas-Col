import { FormEvent, useState } from 'react'
import { loginUser } from '../../services/authService'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const user = await loginUser(email, password)
      if (user) {
        alert('Inicio de sesión correcto')
      }
    } catch (error) {
      console.error(error)
      alert('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Correo
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="campista@campistascol.com"
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  )
}
