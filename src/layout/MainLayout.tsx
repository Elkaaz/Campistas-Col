import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import DemoBanner from '../components/common/DemoBanner'
import '../styles/layout.css'
import '../styles/pages.css'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <DemoBanner />

      <main className="main-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="campista-footer">
        <img
          src="/images/logos/logo-principal.png"
          alt="Campistas Col"
          style={{ height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.15)', padding: 4, marginBottom: 12 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <p style={{ fontWeight: 800, fontSize: 18, margin: '0 0 6px' }}>Campistas Col</p>
        <p><em>"Un campista no es lo que hace, es lo que deja de hacer cuando lo necesitan"</em></p>
        <div className="footer-links">
          <span>🏕️ Siempre Alerta</span>
          <span>🤝 Preparados para Servir</span>
          <span>🌍 Por un Mundo Mejor</span>
          <span>🌱 Construye tu Legado</span>
        </div>
        <p className="footer-copy">
          Red Social Gamificada para Campamentos Juveniles de Colombia · Movimiento Scout · 2026
        </p>
      </footer>
    </div>
  )
}
