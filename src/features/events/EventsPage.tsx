import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { eventsService, type Evento } from '../../services/eventsService'
import '../../styles/pages.css'

const EVENT_TYPE_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  campamento: { icon: '🏕️', color: '#228B22', label: 'Campamento' },
  jornada: { icon: '🌱', color: '#2E8B57', label: 'Jornada' },
  taller: { icon: '📚', color: '#4169E1', label: 'Taller' },
  brigada: { icon: '🏥', color: '#DC143C', label: 'Brigada' },
  reunion: { icon: '👥', color: '#FF6347', label: 'Reunión' },
  otro: { icon: '📅', color: '#888', label: 'Otro' },
}

const EVENT_FILTERS = [
  { key: 'todos', label: 'Todos', icon: '📅' },
  { key: 'campamento', label: 'Campamentos', icon: '🏕️' },
  { key: 'jornada', label: 'Jornadas', icon: '🌱' },
  { key: 'taller', label: 'Talleres', icon: '📚' },
  { key: 'brigada', label: 'Brigadas', icon: '🏥' },
] as const

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string>('todos')

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await eventsService.getUpcomingEvents(50)
        setEvents(data)
      } catch (e) {
        console.error('Error loading events:', e)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const filteredEvents = selectedFilter === 'todos'
    ? events
    : events.filter(e => e.tipo === selectedFilter)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getEventStatus = (event: Evento) => {
    const now = new Date()
    const start = new Date(event.fechaInicio)
    const end = new Date(event.fechaFin)

    if (now > end) return { label: 'Finalizado', color: '#999' }
    if (now >= start) return { label: 'En progreso', color: '#FF9800' }
    if (event.estado === 'inscripciones_abiertas') return { label: 'Inscripciones abiertas', color: '#4CAF50' }
    return { label: 'Próximo', color: '#2196F3' }
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>📅 Calendario de Campamentos</h1>
        <p className="page-subtitle">
          Próximos eventos, campamentos y jornadas de la Red Nacional
        </p>
      </div>

      {/* ── FILTROS ── */}
      <div className="events-filters">
        {EVENT_FILTERS.map((filter) => (
          <button
            key={filter.key}
            className={`event-filter-btn ${selectedFilter === filter.key ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter.key)}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* ── LISTA DE EVENTOS ── */}
      <div className="events-list">
        {loading ? (
          <div className="loading">
            <p>Cargando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: 48, marginBottom: 16 }}>📅</p>
            <h3>No hay eventos próximos</h3>
            <p>Próximamente tendremos nuevos campamentos y jornadas</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const typeInfo = EVENT_TYPE_ICONS[event.tipo] || EVENT_TYPE_ICONS.otro
            const status = getEventStatus(event)
            const isFull = event.cupos > 0 && event.inscritos >= event.cupos
            const spotsLeft = event.cupos - event.inscritos

            return (
              <div key={event.eventoId} className="event-card">
                <div className="event-header" style={{ background: typeInfo.color }}>
                  <div className="event-type-badge">
                    <span>{typeInfo.icon}</span>
                    <span>{typeInfo.label}</span>
                  </div>
                  <span className="event-status" style={{ background: status.color }}>
                    {status.label}
                  </span>
                </div>

                <div className="event-body">
                  <h3>{event.titulo}</h3>
                  <p>{event.descripcion}</p>

                  <div className="event-details">
                    <div className="event-detail">
                      <span className="event-detail-icon">📅</span>
                      <div>
                        <strong>Inicio</strong>
                        <p>{formatDate(event.fechaInicio)}</p>
                      </div>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">🏁</span>
                      <div>
                        <strong>Fin</strong>
                        <p>{formatDate(event.fechaFin)}</p>
                      </div>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">📍</span>
                      <div>
                        <strong>Ubicación</strong>
                        <p>{event.ubicacion}</p>
                        <small>{event.municipio}, {event.departamento}</small>
                      </div>
                    </div>

                    <div className="event-detail">
                      <span className="event-detail-icon">👥</span>
                      <div>
                        <strong>Cupos</strong>
                        <p>
                          {isFull ? (
                            <span style={{ color: '#F44336' }}>Cupos agotados</span>
                          ) : (
                            <>
                              {spotsLeft} disponibles
                              <span style={{ color: '#999', fontSize: 12 }}>
                                {' '}({event.inscritos}/{event.cupos})
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="event-footer">
                    {!isFull && event.estado === 'inscripciones_abiertas' && (
                      <button className="btn-primary" disabled={!user}>
                        {user ? 'Inscribirme' : 'Inicia sesión para inscribirte'}
                      </button>
                    )}
                    {isFull && (
                      <button className="btn-secondary" disabled>
                        Lista de espera
                      </button>
                    )}
                    <span className="event-organizer">
                      Organiza: {event.organizador}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
