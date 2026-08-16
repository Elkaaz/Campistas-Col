import { Link } from 'react-router-dom'
import '../../styles.css'

const NIVELES = [
  { nombre: 'Semilla', icono: '/images/niveles/semilla.png', color: '#8B7355' },
  { nombre: 'Raíz', icono: '/images/niveles/raiz.png', color: '#654321' },
  { nombre: 'Tallo', icono: '/images/niveles/tallo.png', color: '#228B22' },
  { nombre: 'Hoja', icono: '/images/niveles/hoja.png', color: '#32CD32' },
  { nombre: 'Flor', icono: '/images/niveles/flor.png', color: '#FF69B4' },
  { nombre: 'Fruto', icono: '/images/niveles/fruto.png', color: '#FF4500' },
]

export default function LandingPage() {
  return (
    <div className="landing-shell">
      {/* Navbar transparente sobre el hero */}
      <nav className="landing-nav landing-nav--transparent">
        <Link to="/" className="brand">
          <img src="/images/logos/logo-principal.png" alt="Campistas Col" className="brand-logo" />
          <span>Campistas Col</span>
        </Link>
        <div className="nav-actions">
          <Link to="/auth" className="nav-link">Iniciar sesión</Link>
          <Link to="/auth" className="primary-button outline">Únete a la red</Link>
        </div>
      </nav>

      {/* HERO CON FOTO DE FONDO */}
      <header className="hero-section hero-section--full">
        <div className="hero-background">
          <img
            src="/images/backgrounds/bg-2.jpg"
            alt="Campamentos juveniles"
            className="hero-bg-image"
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content hero-content--centered">
          {/* LOGO PRINCIPAL CON NIVELES */}
          <div className="hero-logo-stack">
            <img src="/images/logos/logo-principal.png" alt="Campistas Col" className="hero-main-logo" />
            <div className="hero-niveles">
              {NIVELES.map((nivel, index) => (
                <div
                  key={nivel.nombre}
                  className="hero-nivel-item"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    background: `linear-gradient(135deg, ${nivel.color}22 0%, ${nivel.color}11 100%)`,
                    borderColor: `${nivel.color}44`,
                  }}
                >
                  <img src={nivel.icono} alt={nivel.nombre} className="hero-nivel-icon" />
                  <span className="hero-nivel-name">{nivel.nombre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-badges">
            <span className="badge badge-success pulse">Nueva Plataforma</span>
            <span className="badge badge-info">Red Nacional de Campamentos</span>
          </div>

          <h1 className="hero-title hero-title--impact">
            Tu campamento,<br />
            <span className="text-gradient">ahora es digital.</span>
          </h1>

          <p className="hero-subtitle">
            Conecta con campistas de toda Colombia, comparte tus retos,<br />
            sube de nivel y construye tu legado en la red nacional.
          </p>

          <div className="hero-actions">
            <Link to="/auth" className="primary-button large shadow-glow">
              Crear mi cuenta gratis
            </Link>
            <Link to="/fogon" className="primary-button outline-white">
              Explorar la red
            </Link>
          </div>

          {/* Stats rápidas */}
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>+5.000</strong>
              <span>Retos completados</span>
            </div>
            <div className="hero-stat">
              <strong>+1.200</strong>
              <span>Campistas activos</span>
            </div>
            <div className="hero-stat">
              <strong>32</strong>
              <span>Departamentos</span>
            </div>
          </div>
        </div>

        {/* Flecha hacia abajo */}
        <div className="hero-scroll-indicator">
          <span>Descubre más</span>
          <div className="hero-scroll-arrow">↓</div>
        </div>
      </header>

      {/* Secciones de Beneficios */}
      <section className="benefits-section">
        <div className="benefit-card">
          <span className="benefit-icon">🏆</span>
          <h3>Sistema de Niveles</h3>
          <p>Asciende desde Semilla hasta Fruto completando retos de servicio y formación.</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🤝</span>
          <h3>Comunidad Nacional</h3>
          <p>Conoce campistas de otras regiones y comparte tus experiencias en El Fogón.</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🌱</span>
          <h3>Impacto Real</h3>
          <p>Registra tus actividades de voluntariado y construye tu historial de servicio.</p>
        </div>
      </section>
    </div>
  )
}
