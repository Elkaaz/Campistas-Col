import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RetoCard from '../../components/cards/RetoCard'
import { getRetosCatalogo } from '../../services/catalogService'
import { Reto } from '../../types'
import '../../styles/pages.css'

/**
 * RetosPage - Lista de retos disponibles
 * Grid de retos que el usuario puede completar y publicar
 */
export default function RetosPage() {
  const navigate = useNavigate()
  const [retos, setRetos] = useState<Reto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRetosCatalogo()
      .then(setRetos)
      .finally(() => setLoading(false))
  }, [])

  const handlePublish = (retoId: string) => navigate(`/retos/${retoId}/publicar`)

  return (
    <div className="retos-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>⛰️ Retos Disponibles</h1>
        <p className="page-subtitle">Completa retos para ganar XP y subir de nivel</p>
      </div>

      {/* CONTENT */}
      <div className="retos-container">
        {loading ? (
          <div className="loading">
            <p>Cargando retos...</p>
          </div>
        ) : retos.length === 0 ? (
          <div className="empty-state">
            <p>No hay retos disponibles</p>
          </div>
        ) : (
          <div className="retos-grid">
            {retos.map((reto) => (
              <RetoCard key={reto.retoId} reto={reto} onPublish={handlePublish} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
