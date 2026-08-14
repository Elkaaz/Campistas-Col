import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../../components/cards/PostCard'
import NivelBadge from '../../components/cards/NivelBadge'
import { postsService, profileService } from '../../services'
import { Post, User } from '../../types'
import '../../styles/pages.css'

/**
 * PublicProfilePage - Perfil público de un campista con sus retos publicados
 */
export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([profileService.getProfileByUid(id), postsService.getPostsByUid(id)])
      .then(([profile, userPosts]) => {
        setUser(profile)
        setPosts(userPosts)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="loading"><p>Cargando perfil...</p></div>
  }

  if (!user) {
    return <div className="empty-state"><p>No encontramos este campista</p></div>
  }

  return (
    <div className="public-profile-page">
      <header className="public-profile-header">
        {user.avatar ? (
          <img src={user.avatar} alt={user.displayName} className="public-profile-avatar" />
        ) : (
          <div className="public-profile-avatar placeholder">👤</div>
        )}

        <div className="public-profile-info">
          <h1>{user.displayName}</h1>
          <p className="page-subtitle">📍 {user.municipio}, {user.departamento}</p>
          <NivelBadge nivel={user.nivelActual} size="medium" />
          {user.biografia && <p className="public-profile-bio">{user.biografia}</p>}
        </div>

        <div className="public-profile-stats">
          <div className="bosque-stat">
            <span className="bosque-stat-value">{user.xpTotal}</span>
            <span className="bosque-stat-label">XP total</span>
          </div>
          <div className="bosque-stat">
            <span className="bosque-stat-value">{posts.length}</span>
            <span className="bosque-stat-label">Retos publicados</span>
          </div>
        </div>
      </header>

      <h2 className="section-title">🔥 Retos completados</h2>
      {posts.length === 0 ? (
        <div className="empty-state"><p>Este campista aún no publica retos</p></div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
