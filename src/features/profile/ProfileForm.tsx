import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { completeCampistaProfile } from '../../services/campistaProfileService'
import type { CampistaProfile } from '../../types'

export default function ProfileForm() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const [form, setForm] = useState<Partial<CampistaProfile>>({
    departamento: 'Antioquia',
    municipio: 'Medellín',
    role: 'campista',
    tipoSangre: 'O+',
    eps: 'SURA',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: 'María Gómez',
      telefono: '3001234567',
      parentesco: 'Madre',
    },
    bio: 'Campista motivado por el liderazgo y la convivencia.',
  })

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    if (!user?.uid) {
      setError('Debes estar autenticado')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await completeCampistaProfile(user.uid, form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSave}>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">✓ Perfil guardado exitosamente</div>}

      <label>
        Departamento
        <input
          value={form.departamento || ''}
          onChange={(e) => setForm({ ...form, departamento: e.target.value })}
          required
        />
      </label>

      <label>
        Municipio
        <input
          value={form.municipio || ''}
          onChange={(e) => setForm({ ...form, municipio: e.target.value })}
          required
        />
      </label>

      <label>
        Rol en el grupo
        <select value={form.role || 'campista'} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
          <option value="campista">Campista</option>
          <option value="lider_bosque">Líder de bosque</option>
          <option value="comite_departamental">Comité departamental</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <label>
        Tipo de sangre
        <input
          value={form.tipoSangre || ''}
          onChange={(e) => setForm({ ...form, tipoSangre: e.target.value })}
        />
      </label>

      <label>
        EPS / Régimen
        <input value={form.eps || ''} onChange={(e) => setForm({ ...form, eps: e.target.value })} />
      </label>

      <label>
        Alergias / condiciones
        <textarea
          value={form.alergias || ''}
          onChange={(e) => setForm({ ...form, alergias: e.target.value })}
          rows={3}
        />
      </label>

      <label>
        Contacto emergencia
        <input
          value={form.contactoEmergencia?.nombre || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...form.contactoEmergencia, nombre: e.target.value },
            })
          }
        />
      </label>

      <label>
        Teléfono de emergencia
        <input
          value={form.contactoEmergencia?.telefono || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...form.contactoEmergencia, telefono: e.target.value },
            })
          }
        />
      </label>

      <label>
        Parentesco
        <input
          value={form.contactoEmergencia?.parentesco || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...form.contactoEmergencia, parentesco: e.target.value },
            })
          }
        />
      </label>

      <label>
        Biografía
        <textarea
          value={form.bio || ''}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={4}
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar perfil'}
      </button>
    </form>
  )
}

