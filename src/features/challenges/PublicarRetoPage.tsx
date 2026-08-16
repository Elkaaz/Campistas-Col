import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { postsService } from '../../services'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'
import '../../styles/pages.css'

export default function PublicarRetoPage() {
  const { id: retoId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { upload, uploading, error: uploadError } = useCloudinaryUpload('post')

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenes, setImagenes] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim() || imagenes.length === 0) {
      setError('Completa todos los campos e incluye al menos una imagen')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const imageUrls: string[] = []
      for (const file of imagenes) {
        const url = await upload(file)
        imageUrls.push(url)
      }

      if (!user || !profile) {
        setError('Debes iniciar sesión para publicar')
        setLoading(false)
        return
      }

      const postId = await postsService.createPost(
        user.uid,
        profile.displayName || 'Campista',
        profile.avatarUrl || '',
        profile.nivelActual || 'semilla',
        '#8B7355',
        {
          retoId: retoId || 'reto_default',
          retoTitulo: 'Reto completado',
          retoTipo: 'fogata',
          titulo,
          descripcion,
          imagenes: imageUrls,
          xpAsignado: 80,
        },
        profile.municipio || '',
        profile.departamento || ''
      )

      alert('✅ Reto publicado exitosamente. Pendiente de validación por líder.')
      navigate('/fogon')
    } catch (err) {
      console.error('Error publishing post:', err)
      setError(err instanceof Error ? err.message : 'Error al publicar reto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="publicar-reto-page">
      <div className="page-header">
        <h1>📸 Publicar Reto Completado</h1>
        <p className="page-subtitle">Comparte tu evidencia y gana XP</p>
      </div>

      <div className="publicar-form-container">
        <form onSubmit={handleSubmit} className="publicar-form">
          {(error || uploadError) && (
            <div className="form-error">{error || uploadError}</div>
          )}

          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Mi fogata segura en el campamento"
              maxLength={100}
              required
            />
            <small>{titulo.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe cómo completaste el reto, qué aprendiste, etc..."
              rows={5}
              maxLength={500}
              required
            />
            <small>{descripcion.length}/500</small>
          </div>

          <div className="form-group">
            <label htmlFor="imagenes">Evidencia (fotos/videos)</label>
            <div className="file-input-wrapper">
              <input
                id="imagenes"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleImageSelect}
                required
              />
              <span className="file-input-label">
                {imagenes.length > 0
                  ? `${imagenes.length} archivo(s) seleccionado(s)`
                  : 'Selecciona 1-5 archivos'}
              </span>
            </div>
            {imagenes.length > 0 && (
              <div className="imagenes-preview">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="imagen-preview-item">
                    <span>{img.name}</span>
                    <small>{(img.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading || uploading}>
              {loading || uploading ? 'Publicando...' : 'Publicar Reto'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/fogon')}
              disabled={loading || uploading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
