import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../../components/cards/PostCard'
import { RETO_TYPES } from '../../lib/constants'
import { Post, RetoTipo } from '../../types'
import { postsService, interactionsService } from '../../services'
import { useAuth } from '../../hooks/useAuth'
import '../../styles/pages.css'

const HERO_PHOTOS = [
  '/images/backgrounds/bg-1.jpg',
  '/images/backgrounds/bg-2.jpg',
  '/images/backgrounds/bg-3.jpg',
]

const PAGE_SIZE = 12

export default function HomePage() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedFilter, setFilter] = useState<RetoTipo | 'todos'>('todos')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [heroBg] = useState(() => HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError(null); setHasMore(true)
        const data = selectedFilter === 'todos'
          ? await postsService.getFeedSocial(PAGE_SIZE)
          : await postsService.getPostsByType(selectedFilter, PAGE_SIZE)
        setPosts(data)
        setHasMore(data.length >= PAGE_SIZE)
      } catch {
        setError('Error al cargar publicaciones'); setPosts([])
      } finally { setLoading(false) }
    }
    load()
  }, [selectedFilter])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    try {
      setLoadingMore(true)
      const next = selectedFilter === 'todos'
        ? await postsService.getFeedSocial(posts.length + PAGE_SIZE)
        : await postsService.getPostsByType(selectedFilter, posts.length + PAGE_SIZE)
      const newPosts = next.slice(posts.length)
      setPosts(prev => [...prev, ...newPosts])
      setHasMore(newPosts.length >= PAGE_SIZE)
    } catch {
      console.error('Error loading more posts')
    } finally {
      setLoadingMore(false)
    }
  }

  const reload = async () => {
    const data = selectedFilter === 'todos'
      ? await postsService.getFeedSocial(posts.length)
      : await postsService.getPostsByType(selectedFilter, posts.length)
    setPosts(data)
  }

  const handleFogata = async (postId: string) => {
    if (!user) return
    try {
      await interactionsService.addInteraction(
        user.uid,
        profile?.displayName || user.displayName || 'Campista',
        profile?.avatarUrl || '',
        postId,
        'fogata'
      )
      await reload()
    } catch (e) { console.error(e) }
  }

  const handleNudo = async (postId: string) => {
    if (!user) return
    try {
      await interactionsService.addInteraction(
        user.uid,
        profile?.displayName || user.displayName || 'Campista',
        profile?.avatarUrl || '',
        postId,
        'nudo'
      )
      await reload()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="home-page">

      {/* ── HERO BANNER ── */}
      <div className="fogon-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="fogon-hero-overlay" />
        <div className="fogon-hero-content">
          <h1>🔥 El Fogón</h1>
          <p>Muro de retos completados por campistas de toda Colombia</p>
          <Link to="/retos" className="fogon-hero-btn">Ver retos disponibles →</Link>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="filters-container">
        <button
          className={`filter-btn ${selectedFilter === 'todos' ? 'active' : ''}`}
          onClick={() => setFilter('todos')}
        >🏕️ Todos</button>

        {(Object.entries(RETO_TYPES) as [RetoTipo, any][]).map(([key, val]) => (
          <button
            key={key}
            className={`filter-btn ${selectedFilter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
            style={selectedFilter === key ? { backgroundColor: val.color, borderColor: val.color } : {}}
          >
            {val.icon} <span className="filter-label">{val.label}</span>
          </button>
        ))}
      </div>

      {/* ── FEED ── */}
      <div className="feed-container">
        {error && <div className="error-state"><p>⚠️ {error}</p></div>}

        {loading ? (
          <div className="loading-grid">
            {[1,2,3].map(i => <div key={i} className="post-skeleton" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-fogon">
            <img src="/images/backgrounds/foto-campistas-1.jpg" alt="Campistas" className="empty-fogon-img" />
            <div className="empty-fogon-text">
              <h3>¡El fogón está esperando chispas! 🔥</h3>
              <p>Sé el primero en publicar un reto completado</p>
              <Link to="/retos" className="btn-primary">Ver retos →</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} onFogata={handleFogata} onNudo={handleNudo} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  {loadingMore ? 'Cargando...' : 'Cargar más publicaciones'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FAB (solo si hay sesion) ── */}
      {user && (
        <Link to="/retos" className="fab" title="Publicar nuevo reto">+</Link>
      )}
    </div>
  )
}
