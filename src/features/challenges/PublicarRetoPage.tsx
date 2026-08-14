import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postsService } from '../../services'
import { getRetosCatalogo } from '../../services/catalogService'
import { uploadImages } from '../../services/imageService'
import { useAuth } from '../../context/AuthContext'
import { LEVELS } from '../../lib/constants'
import type { Reto } from '../../types'
import '../../styles/pages.css'
import '../../styles/forms.css'

/**
 * PublicarRetoPage - Formulario para publicar reto completado
 * Usuario carga foto/video como evidencia del reto completado
 */
export default function PublicarRetoPage() {
  const { id: retoId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [reto, setReto] = useState<Reto | null>(null)

  useEffect(() => {
    getRetosCatalogo().then((retos) => {
      setReto(retos.find((item) => item.retoId === retoId) ?? null)
    })
  }, [retoId])

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
      if (!profile) throw new Error('Debes iniciar sesión para publicar un reto')

      const imageUrls = await uploadImages(imagenes)
      const nivel = LEVELS[profile.nivelActual]

      await postsService.createPost(
        profile.uid,
        profile.displayName,
        profile.avatar,
        nivel.nombre,
        nivel.color,
        {
          retoId: reto?.retoId || retoId || 'reto_default',
          retoTitulo: reto?.titulo || 'Reto',
          retoTipo: reto?.tipo || 'fogata',
          titulo,
          descripcion,
          imagenes: imageUrls,
          xpAsignado: reto?.xpRecompensa ?? 80,
        },
        profile.municipio,
        profile.departamento
      )

      navigate('/')
    } catch (err) {
      console.error('Error publishing post:', err)
      setError(err instanceof Error ? err.message : 'Error al publicar reto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="publicar-reto-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>📸 Publicar Reto Completado</h1>
        <p className="page-subtitle">
          {reto ? `${reto.titulo} · +${reto.xpRecompensa} XP` : 'Comparte tu evidencia y gana XP'}
        </p>
      </div>

      {/* FORM */}
      <div className="publicar-form-container">
        <form onSubmit={handleSubmit} className="publicar-form">
          {error && <div className="form-error">{error}</div>}

          {/* TÍTULO */}
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

          {/* DESCRIPCIÓN */}
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

          {/* IMAGENES */}
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

          {/* BOTONES */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Reto'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
