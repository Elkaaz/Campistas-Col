import { FormEvent, useState } from 'react'
import { registerUser } from '../../services/authService'

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    departamento: '',
    municipio: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      await registerUser(form.email, form.password, {
        firstName: form.firstName,
        lastName: form.lastName,
        departamento: form.departamento,
        municipio: form.municipio,
        role: 'campista',
        nivelActual: 'aspirante',
        xpTotal: 0,
        perfilCompleto: false,
      })

      alert('Usuario registrado')
    } catch (error) {
      console.error(error)
      alert('No se pudo registrar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      </label>

      <label>
        Apellido
        <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      </label>

      <label>
        Departamento
        <input value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} />
      </label>

      <label>
        Municipio
        <input value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} />
      </label>

      <label>
        Correo
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>

      <label>
        Contraseña
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarme'}
      </button>
    </form>
  )
}
