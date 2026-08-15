import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { postsService, commentsService, interactionsService } from '../../services'
import PostCard from '../../components/cards/PostCard'
import './PostDetail.css'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, profile } = useAuth()
  const [post, setPost] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      try {
        setLoading(true)
        const allPosts = await postsService.getFeedSocial(50)
        const found = allPosts.find(p => p.postId === id)
        setPost(found || null)
        if (found) {
          const cmts = await commentsService.getCommentsByPostId(id)
          setComments(cmts)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile || !id || !newComment.trim()) return
    try {
      setSubmitting(true)
      await commentsService.createComment({
        postId: id,
        uid: user.uid,
        usuarioNombre: profile.displayName || user.displayName || 'Campista',
        usuarioAvatar: profile.avatarUrl || '',
        usuarioNivel: profile.nivelActual || 'semilla',
        texto: newComment.trim(),
      })
      setNewComment('')
      const cmts = await commentsService.getCommentsByPostId(id)
      setComments(cmts)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
  if (!post) return <div style={{ padding: 40, textAlign: 'center' }}>Publicación no encontrada</div>

  return (
    <div className="post-detail-page">
      <Link to="/fogon" className="back-link">← Volver al Fogón</Link>

      <PostCard post={post} />

      <section className="comments-section">
        <h3>💬 Comentarios ({comments.length})</h3>

        {user && (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              rows={3}
            />
            <button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        )}

        <div className="comments-list">
          {comments.length === 0 && (
            <p className="no-comments">Sé el primero en comentar</p>
          )}
          {comments.map((c) => (
            <div key={c.commentId} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{c.usuarioNombre}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleDateString('es-CO')}
                </span>
              </div>
              <p className="comment-text">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
