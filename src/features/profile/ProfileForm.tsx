import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateCampistaProfile } from '../../services/campistaProfileService'
import type { CampistaProfile } from '../../types'

export default function ProfileForm() {
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState<Partial<CampistaProfile>>({
    departamento: '',
    municipio: '',
    tipoSangre: '',
    eps: '',
    alergias: '',
    contactoEmergencia: { nombre: '', telefono: '', parentesco: '' },
    bio: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        departamento: profile.departamento || '',
        municipio: profile.municipio || '',
        tipoSangre: profile.tipoSangre || '',
        eps: profile.eps || '',
        alergias: profile.alergias || '',
        contactoEmergencia: profile.contactoEmergencia || { nombre: '', telefono: '', parentesco: '' },
        bio: profile.bio || '',
      })
    }
  }, [profile])

  async function handleSave(e: FormEvent) {
    e.preventDefault()

    if (!user?.uid) {
      setError('Debes estar autenticado')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateCampistaProfile(user.uid, form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <div style={{ padding: 20 }}>Cargando perfil...</div>

  return (
    <form className="form-grid" onSubmit={handleSave}>
      {error && <div className="form-error" style={{ color: 'red', padding: 10, background: '#fee2e2' }}>{error}</div>}
      {success && <div className="form-success" style={{ color: 'green', padding: 10, background: '#dcfce7' }}>✓ Perfil guardado exitosamente</div>}

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
        Contacto emergencia - Nombre
        <input
          value={form.contactoEmergencia?.nombre || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...(form.contactoEmergencia as any), nombre: e.target.value },
            })
          }
        />
      </label>

      <label>
        Contacto emergencia - Teléfono
        <input
          value={form.contactoEmergencia?.telefono || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...(form.contactoEmergencia as any), telefono: e.target.value },
            })
          }
        />
      </label>

      <label>
        Contacto emergencia - Parentesco
        <input
          value={form.contactoEmergencia?.parentesco || ''}
          onChange={(e) =>
            setForm({
              ...form,
              contactoEmergencia: { ...(form.contactoEmergencia as any), parentesco: e.target.value },
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
