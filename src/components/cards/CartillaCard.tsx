import { Cartilla, CartillaWithProgress } from '../../types'
import '../../styles/components.css'

// PDFs reales de las cartillas (project docs folder)
const CARTILLA_PDFS: Record<string, string> = {
  'tecnicas-fogata':       '/docs/CARTILLA-TeCNICAS-CAMPAMENTILES.pdf',
  'nudos-esenciales':      '/docs/CARTILLA-TeCNICAS-CAMPAMENTILES.pdf',
  'construccion-refugios': '/docs/CARTILLA-TeCNICAS-CAMPAMENTILES.pdf',
  'primeros-auxilios':     '/docs/CARTILLA-PREVENCION-Y-SALUD.pdf',
  'conciencia-ambiental':  '/docs/CARTILLA-CONCIENCIA-AMBIENTAL.pdf',
  'liderazgo-equipo':      '/docs/CARTILLAFORMACION-CRECIMIENTO-PERSONAL-VOLUNTARIADO-LIDERAZGO.pdf',
  'orientacion-navegacion':'/docs/CARTILLA-TeCNICAS-CAMPAMENTILES.pdf',
  'cocina-campo':          '/docs/CARTILLA-TeCNICAS-CAMPAMENTILES.pdf',
}

// Fotos reales de campistas como portadas
const CARTILLA_COVERS: Record<string, string> = {
  'tecnicas-fogata':       '/images/backgrounds/foto-campistas-1.jpg',
  'nudos-esenciales':      '/images/backgrounds/foto-campistas-2.jpg',
  'construccion-refugios': '/images/backgrounds/foto-campistas-3.jpg',
  'primeros-auxilios':     '/images/backgrounds/foto-campistas-4.jpg',
  'conciencia-ambiental':  '/images/backgrounds/bg-3.jpg',
  'liderazgo-equipo':      '/images/backgrounds/foto-campistas-5.jpg',
  'orientacion-navegacion':'/images/backgrounds/bg-4.jpg',
  'cocina-campo':          '/images/backgrounds/foto-campistas-6.jpg',
}

interface CartillaCardProps {
  cartilla: CartillaWithProgress | Cartilla
  onContinue?: (cartillaId: string) => void
}

export default function CartillaCard({ cartilla }: CartillaCardProps) {
  const withProgress  = cartilla as CartillaWithProgress
  const isCompleted   = withProgress.usuarioProgreso?.completada
  const desbloqueada  = withProgress.desbloqueada !== false
  const pdfUrl        = CARTILLA_PDFS[cartilla.slug] ?? '#'
  const coverImg      = CARTILLA_COVERS[cartilla.slug] ?? '/images/backgrounds/bg-1.jpg'
  const pct           = withProgress.usuarioProgreso?.porcentajeLeido ?? 0

  return (
    <div
      className={`cartilla-card ${!desbloqueada ? 'cartilla-locked' : ''} ${isCompleted ? 'cartilla-done' : ''}`}
      style={{ borderTop: `4px solid ${cartilla.colorTema}` }}
    >
      {/* PORTADA */}
      <div className="cartilla-cover" style={{ backgroundColor: cartilla.colorTema }}>
        <img src={coverImg} alt={cartilla.nombre} className="cartilla-cover-img" />
        <div className="cartilla-cover-overlay" style={{ background: `${cartilla.colorTema}99` }} />
        <div className="cartilla-cover-info">
          <span className="cartilla-cover-icon">{cartilla.icono}</span>
          {isCompleted && <span className="cartilla-completed-badge">✅ Completada</span>}
          {!desbloqueada && <span className="cartilla-locked-badge">🔒 Bloqueada</span>}
        </div>
      </div>

      {/* CUERPO */}
      <div className="cartilla-content">
        <h3 className="cartilla-title">{cartilla.nombre}</h3>
        <p className="cartilla-description">{cartilla.descripcion}</p>

        {/* NIVEL */}
        <span className="cartilla-nivel-tag" style={{ color: cartilla.colorTema }}>
          {cartilla.nivel}
        </span>

        {/* BARRA PROGRESO */}
        {desbloqueada && !isCompleted && (
          <div className="cartilla-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: cartilla.colorTema }} />
            </div>
            <small>{pct}% leído</small>
          </div>
        )}

        {/* STATS */}
        <div className="cartilla-stats">
          <span>👥 {withProgress.competidosTotal ?? 0} completaron</span>
          <span>📂 {cartilla.categoria}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="cartilla-footer">
        {!desbloqueada ? (
          <button className="btn-locked" disabled>
            🔒 Requiere nivel {cartilla.nivel}
          </button>
        ) : (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-leer"
            style={{ backgroundColor: cartilla.colorTema }}
          >
            📖 {isCompleted ? 'Releer cartilla' : pct > 0 ? 'Continuar' : 'Empezar'}
          </a>
        )}
      </div>
    </div>
  )
}
