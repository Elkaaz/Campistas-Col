import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../../components/cards/PostCard'
import { RETO_TYPES } from '../../lib/constants'
import { Post, RetoTipo } from '../../types'
import { postsService, interactionsService } from '../../services'
import '../../styles/pages.css'

// Fotos reales de campistas para el empty state / hero
const HERO_PHOTOS = [
  '/images/backgrounds/bg-1.jpg',
  '/images/backgrounds/bg-2.jpg',
  '/images/backgrounds/bg-3.jpg',
]

export default function HomePage() {
  const [posts, setPosts]               = useState<Post[]>([])
  const [selectedFilter, setFilter]     = useState<RetoTipo | 'todos'>('todos')
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [heroBg]                        = useState(() => HERO_PHOTOS[Math.floor(Math.random() * HERO_PHOTOS.length)])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError(null)
        const data = selectedFilter === 'todos'
          ? await postsService.getFeedSocial(20)
          : await postsService.getPostsByType(selectedFilter, 20)
        setPosts(data)
      } catch {
        setError('Error al cargar publicaciones'); setPosts([])
      } finally { setLoading(false) }
    }
    load()
  }, [selectedFilter])

  const reload = async () => {
    const data = selectedFilter === 'todos'
      ? await postsService.getFeedSocial(20)
      : await postsService.getPostsByType(selectedFilter, 20)
    setPosts(data)
  }

  const handleFogata = async (postId: string) => {
    try { await interactionsService.addInteraction('user_current','Usuario','',postId,'fogata'); await reload() }
    catch (e) { console.error(e) }
  }
  const handleNudo = async (postId: string) => {
    try { await interactionsService.addInteraction('user_current','Usuario','',postId,'nudo'); await reload() }
    catch (e) { console.error(e) }
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
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} onFogata={handleFogata} onNudo={handleNudo} />
            ))}
          </div>
        )}
      </div>

      {/* ── FAB ── */}
      <Link to="/retos" className="fab" title="Publicar nuevo reto">+</Link>
    </div>
  )
}
