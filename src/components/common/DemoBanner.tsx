import { useAuth } from '../../context/AuthContext'

/**
 * Aviso visible cuando la app corre con datos de demostración
 * (sin credenciales de Firebase configuradas).
 */
export default function DemoBanner() {
  const { demoMode } = useAuth()

  if (!demoMode) return null

  return (
    <div className="demo-banner">
      🧪 <strong>Modo demo</strong> — contenido de ejemplo para presentación. Los cambios no se
      guardan: al configurar Firebase la app usa datos reales automáticamente.
    </div>
  )
}
