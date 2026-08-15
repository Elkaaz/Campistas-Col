import { Link } from 'react-router-dom'
import '../../styles.css'

export default function LandingPage() {
  return (
    <div className="landing-shell">
      {/* Navbar Minimalista */}
      <nav className="landing-nav">
        <div className="brand">🏕️ Campistas Col</div>
        <div className="nav-actions">
          <Link to="/auth" className="nav-link">Iniciar sesión</Link>
          <Link to="/auth" className="primary-button outline">Únete a la red</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="badge badge-success pulse">Nueva Plataforma</span>
          <h1 className="hero-title">
            Tu campamento,<br />
            <span className="text-gradient">ahora es digital.</span>
          </h1>
          <p className="hero-subtitle">
            Conecta con otros campistas de Colombia, comparte tus retos, 
            sube de nivel y contribuye a la red nacional de Campamentos Juveniles.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="primary-button large shadow-glow">
              Crear mi cuenta gratis
            </Link>
          </div>
        </div>
        
        {/* Gráfico decorativo / Glassmorphism */}
        <div className="hero-visual">
          <div className="glass-card">
            <div className="glass-icon">🔥</div>
            <div>
              <strong>El Fogón Nacional</strong>
              <span>+5,000 retos completados</span>
            </div>
          </div>
          <div className="glass-card offset">
            <div className="glass-icon">🌲</div>
            <div>
              <strong>Tu Bosque</strong>
              <span>Siembra semillas y crece</span>
            </div>
          </div>
        </div>
      </header>

      {/* Secciones de Beneficios */}
      <section className="benefits-section">
        <div className="benefit-card">
          <span className="benefit-icon">🏆</span>
          <h3>Sistema de Niveles</h3>
          <p>Asciende desde Semilla hasta Raíz completando retos de servicio y formación.</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🤝</span>
          <h3>Comunidad Nacional</h3>
          <p>Conoce campistas de otras regiones y comparte tus experiencias en El Fogón.</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🌱</span>
          <h3>Impacto Real</h3>
          <p>Registra tus actividades de conciencia ambiental y prevención y salud.</p>
        </div>
      </section>
    </div>
  )
}
