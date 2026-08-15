import { Link } from 'react-router-dom'
import { Post } from '../../types'
import { getRetoTypeIcon, getRetoTypeLabel } from '../../lib/colors'
import '../../styles/components.css'

interface PostCardProps {
  post: Post
  onFogata?: (postId: string) => void
  onNudo?: (postId: string) => void
  userHasFogata?: boolean
  userHasNudo?: boolean
}

export default function PostCard({
  post,
  onFogata,
  onNudo,
  userHasFogata = false,
  userHasNudo = false,
}: PostCardProps) {
  return (
    <article className="post-card">
      {/* HEADER - Autor */}
      <div className="post-header">
        <Link to={`/perfiles/${post.uid}`} className="post-author-link">
          <div className="post-author">
            {post.autoresAvatar && (
              <img
                src={post.autoresAvatar}
                alt={post.autoresNombre}
                className="author-avatar"
                style={{ borderColor: post.autoresNivelColor }}
              />
            )}
            <div className="author-info">
              <div className="author-name">{post.autoresNombre}</div>
              <div className="author-meta">
                <span className="author-level" style={{ color: post.autoresNivelColor }}>
                  {post.autoresNivel}
                </span>
                <span className="author-location">📍 {post.municipio}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* TIPO DE RETO - Badge */}
        <div className="reto-badge" style={{ backgroundColor: post.retoTipo }}>
          <span className="badge-icon">{getRetoTypeIcon(post.retoTipo as any)}</span>
          <span className="badge-label">{getRetoTypeLabel(post.retoTipo as any)}</span>
        </div>
      </div>

      {/* CONTENIDO - Texto */}
      <div className="post-content">
        <Link to={`/fogon/${post.postId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{post.titulo}</h3>
          <p>{post.descripcion.length > 140 ? post.descripcion.slice(0, 140) + '...' : post.descripcion}</p>
        </Link>
      </div>

      {/* IMAGEN */}
      {post.imagenes.length > 0 && (
        <Link to={`/fogon/${post.postId}`} style={{ textDecoration: 'none' }}>
          <div className="post-image-container">
            <img src={post.imagenes[0]} alt={post.titulo} className="post-image" />
            {post.imagenes.length > 1 && (
              <div className="image-count">+{post.imagenes.length - 1}</div>
            )}
          </div>
        </Link>
      )}

      {/* VALIDACIÓN */}
      {post.estado === 'validado' && (
        <div className="validation-banner">
          <span className="validation-icon">✅</span>
          <span className="validation-text">
            Validado por {post.validadorNombre} · +{post.xpAsignado} XP
          </span>
        </div>
      )}

      {post.estado === 'pendiente_validacion' && (
        <div className="pending-banner">
          <span className="pending-icon">⏳</span>
          <span className="pending-text">Pendiente de validación</span>
        </div>
      )}

      {post.estado === 'rechazado' && (
        <div className="rejected-banner">
          <span className="rejected-icon">❌</span>
          <span className="rejected-text">Rechazado</span>
        </div>
      )}

      {/* FOOTER - Interacciones */}
      <div className="post-footer">
        <button
          className={`reaction-btn ${userHasFogata ? 'active' : ''}`}
          onClick={() => onFogata?.(post.postId)}
          title="Dar fogata"
        >
          <span className="reaction-icon">🔥</span>
          <span className="reaction-count">{post.contadorFogatas}</span>
        </button>

        <button
          className={`reaction-btn ${userHasNudo ? 'active' : ''}`}
          onClick={() => onNudo?.(post.postId)}
          title="Dar nudo"
        >
          <span className="reaction-icon">🪢</span>
          <span className="reaction-count">{post.contadorNudos}</span>
        </button>

        <Link to={`/fogon/${post.postId}`} className="reaction-btn" title="Comentarios" style={{ textDecoration: 'none' }}>
          <span className="reaction-icon">💬</span>
          <span className="reaction-count">{post.contadorComentarios}</span>
        </Link>

        <button className="reaction-btn" title="Compartir">
          <span className="reaction-icon">📌</span>
        </button>
      </div>

      {/* META - Fecha */}
      <div className="post-meta">
        <small>{new Date(post.createdAt).toLocaleDateString('es-CO')}</small>
      </div>
    </article>
  )
}
