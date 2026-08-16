import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateCampistaProfile } from '../../services/campistaProfileService'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'
import type { CampistaProfile } from '../../types'

export default function ProfileForm() {
  const { user, profile, loading: authLoading, reloadProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { upload, uploading, error: uploadError } = useCloudinaryUpload('avatar')

  const [form, setForm] = useState<Partial<CampistaProfile>>({
    departamento: '',
    municipio: '',
    tipoSangre: '',
    eps: '',
    alergias: '',
    contactoEmergencia: { nombre: '', telefono: '', parentesco: '' },
    bio: '',
    nombreBosque: '',
    habilidadEspecial: '',
    redesSociales: {},
    tipoDocumento: '',
    documento: '',
    fechaNacimiento: '',
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
        nombreBosque: (profile as any).nombreBosque || '',
        habilidadEspecial: (profile as any).habilidadEspecial || '',
        redesSociales: (profile as any).redesSociales || {},
        tipoDocumento: (profile as any).tipoDocumento || '',
        documento: (profile as any).documento || '',
        fechaNacimiento: (profile as any).fechaNacimiento ? new Date((profile as any).fechaNacimiento).toISOString().slice(0, 10) : '',
      })
    }
  }, [profile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.uid) return
    try {
      const url = await upload(file)
      await updateCampistaProfile(user.uid, { avatarUrl: url } as any)
      await reloadProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

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
      await reloadProfile()
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
      {(error || uploadError) && <div className="form-error" style={{ color: 'red', padding: 10, background: '#fee2e2' }}>{error || uploadError}</div>}
      {success && <div className="form-success" style={{ color: 'green', padding: 10, background: '#dcfce7' }}>✓ Perfil guardado exitosamente</div>}

      <label>
        Avatar
        <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
        {uploading && <small>Subiendo...</small>}
      </label>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <label>
          Tipo de documento
          <select
            value={form.tipoDocumento || ''}
            onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
          >
            <option value="">Selecciona...</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PAS">Pasaporte</option>
          </select>
        </label>

        <label>
          Número de documento
          <input
            value={form.documento || ''}
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
          />
        </label>

        <label>
          Fecha de nacimiento
          <input
            type="date"
            value={form.fechaNacimiento || ''}
            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
          />
        </label>
      </div>

      <label>
        Nombre del bosque / grupo scout
        <input
          value={form.nombreBosque || ''}
          onChange={(e) => setForm({ ...form, nombreBosque: e.target.value })}
          placeholder="Ej: Bosque El Roble"
        />
      </label>

      <label>
        Habilidad especial
        <select
          value={form.habilidadEspecial || ''}
          onChange={(e) => setForm({ ...form, habilidadEspecial: e.target.value })}
        >
          <option value="">Selecciona una...</option>
          <option value="nudos">Nudos</option>
          <option value="fogatas">Fogatas</option>
          <option value="expresión_cultural">Expresión cultural</option>
          <option value="liderazgo">Liderazgo</option>
          <option value="naturaleza">Naturaleza</option>
          <option value="primeros_auxilios">Primeros auxilios</option>
          <option value="organización">Organización</option>
          <option value="creatividad">Creatividad</option>
        </select>
      </label>

      <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <legend style={{ padding: '0 8px', fontWeight: 700 }}>Redes sociales</legend>
        {['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin'].map((red) => (
          <label key={red} style={{ display: 'block', marginBottom: 8 }}>
            {red}
            <input
              value={(form.redesSociales as any)?.[red] || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  redesSociales: { ...(form.redesSociales as any), [red]: e.target.value },
                })
              }
              placeholder={`@usuario`}
            />
          </label>
        ))}
      </fieldset>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar perfil'}
      </button>
    </form>
  )
}
