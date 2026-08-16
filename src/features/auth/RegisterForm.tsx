import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { upload, uploading, error: uploadError } = useCloudinaryUpload('avatar')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    departamento: '',
    municipio: '',
    avatarFile: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      let avatarUrl = ''
      if (form.avatarFile) {
        avatarUrl = await upload(form.avatarFile)
      }

      await registerUser(form.email, form.password, {
        firstName: form.firstName,
        lastName: form.lastName,
        departamento: form.departamento,
        municipio: form.municipio,
        role: 'campista',
        nivelActual: 'semilla',
        xpTotal: 0,
        perfilCompleto: false,
        avatarUrl,
      })

      navigate('/fogon', { replace: true })
    } catch (err: any) {
      console.error('[RegisterForm]', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con este correo')
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy debil, usa al menos 6 caracteres')
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo no es valido')
      } else {
        setError(err instanceof Error ? err.message : 'Error al crear la cuenta. Intenta de nuevo')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {(error || uploadError) && (
        <div style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#fca5a5',
          fontSize: 14,
        }}>
          ⚠️ {error || uploadError}
        </div>
      )}

      <label>
        Nombre
        <input
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          placeholder="Tu nombre"
          required
          disabled={loading || uploading}
        />
      </label>

      <label>
        Apellido
        <input
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          placeholder="Tu apellido"
          required
          disabled={loading || uploading}
        />
      </label>

      <label>
        Departamento
        <input
          value={form.departamento}
          onChange={(e) => setForm({ ...form, departamento: e.target.value })}
          placeholder="Ej: Antioquia"
          required
          disabled={loading || uploading}
        />
      </label>

      <label>
        Municipio
        <input
          value={form.municipio}
          onChange={(e) => setForm({ ...form, municipio: e.target.value })}
          placeholder="Ej: Medellin"
          required
          disabled={loading || uploading}
        />
      </label>

      <label>
        Avatar
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, avatarFile: e.target.files?.[0] || null })}
          disabled={loading || uploading}
        />
        {uploading && <small style={{ opacity: 0.7 }}>Subiendo avatar...</small>}
      </label>

      <label>
        Correo electronico
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="campista@email.com"
          required
          disabled={loading || uploading}
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Minimo 6 caracteres"
          required
          disabled={loading || uploading}
          minLength={6}
        />
      </label>

      <label>
        Confirmar contraseña
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Repite tu contraseña"
          required
          disabled={loading || uploading}
          minLength={6}
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading || uploading}>
        {loading || uploading ? 'Creando cuenta...' : 'Unirme al campamento 🌱'}
      </button>
    </form>
  )
}

