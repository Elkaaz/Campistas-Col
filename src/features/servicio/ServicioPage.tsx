import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { servicioService, type CreateServicioInput } from '../../services/servicioService'
import type { Servicio } from '../../types'
import { DEPARTAMENTOS } from '../../lib/constants'
import '../../styles/pages.css'

const SERVICIO_TIPOS = [
  { value: 'reforestacion', label: '🌱 Reforestación', icon: '🌱' },
  { value: 'brigada_salud', label: '🏥 Brigada de Salud', icon: '🏥' },
  { value: 'taller_formacion', label: '📚 Taller de Formación', icon: '📚' },
  { value: 'campamento', label: '🏕️ Campamento', icon: '🏕️' },
  { value: 'jornada_comunitaria', label: '🤝 Jornada Comunitaria', icon: '🤝' },
  { value: 'otro', label: '📋 Otro', icon: '📋' },
]

export default function ServicioPage() {
  const { user, profile } = useAuth()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [totalHoras, setTotalHoras] = useState(0)

  const [formData, setFormData] = useState<CreateServicioInput>({
    tipo: 'taller_formacion',
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    horas: 1,
    ubicacion: '',
    departamento: '',
    municipio: '',
  })

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        const data = await servicioService.getServiciosByUser(user.uid)
        setServicios(data)
        const total = await servicioService.getTotalHoras(user.uid)
        setTotalHoras(total)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await servicioService.createServicio(user.uid, formData)
      setShowForm(false)
      setFormData({
        tipo: 'taller_formacion',
        titulo: '',
        descripcion: '',
        fecha: new Date(),
        horas: 1,
        ubicacion: '',
        departamento: '',
        municipio: '',
      })
      const data = await servicioService.getServiciosByUser(user.uid)
      setServicios(data)
      const total = await servicioService.getTotalHoras(user.uid)
      setTotalHoras(total)
    } catch (e) {
      console.error(e)
    }
  }

  const getTipoInfo = (tipo: string) => {
    return SERVICIO_TIPOS.find(t => t.value === tipo) || { label: tipo, icon: '📋' }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'validado':
        return { label: '✅ Validado', color: '#4CAF50' }
      case 'pendiente':
        return { label: '⏳ Pendiente', color: '#FF9800' }
      case 'rechazado':
        return { label: '❌ Rechazado', color: '#F44336' }
      default:
        return { label: estado, color: '#999' }
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>

  return (
    <div className="servicio-page">
      <div className="page-header">
        <h1>⏱️ Mis Horas de Servicio</h1>
        <p className="page-subtitle">
          Registra y consulta tu historial de voluntariado
        </p>
      </div>

      {/* ── RESUMEN ── */}
      <div className="servicio-summary">
        <div className="servicio-stat-card">
          <div className="servicio-stat-icon">⏱️</div>
          <div className="servicio-stat-info">
            <h3>{totalHoras}</h3>
            <p>Horas totales</p>
          </div>
        </div>
        <div className="servicio-stat-card">
          <div className="servicio-stat-icon">📋</div>
          <div className="servicio-stat-info">
            <h3>{servicios.length}</h3>
            <p>Actividades registradas</p>
          </div>
        </div>
        <div className="servicio-stat-card">
          <div className="servicio-stat-icon">✅</div>
          <div className="servicio-stat-info">
            <h3>{servicios.filter(s => s.estado === 'validado').length}</h3>
            <p>Validadas</p>
          </div>
        </div>
      </div>

      {/* ── BOTÓN NUEVO REGISTRO ── */}
      {!showForm && (
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 24 }}>
          + Registrar nueva actividad
        </button>
      )}

      {/* ── FORMULARIO ── */}
      {showForm && (
        <div className="servicio-form-card">
          <h3>Nuevo Registro de Servicio</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de actividad</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  required
                >
                  {SERVICIO_TIPOS.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Jornada de reforestación"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe la actividad realizada..."
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={new Date(formData.fecha).toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, fecha: new Date(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horas</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.horas}
                  onChange={(e) => setFormData({ ...formData, horas: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departamento</label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {DEPARTAMENTOS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Municipio</label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ubicación específica</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                placeholder="Ej: Parque Municipal, Vereda El Roble"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Guardar</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── HISTORIAL ── */}
      <div className="servicio-history">
        <h3>Historial de Actividades</h3>
        {servicios.length === 0 ? (
          <div className="empty-state">
            <p>No has registrado actividades de servicio aún</p>
            <p style={{ fontSize: 13, opacity: 0.6 }}>Comienza registrando tu primera actividad</p>
          </div>
        ) : (
          <div className="servicio-list">
            {servicios.map((servicio) => {
              const tipoInfo = getTipoInfo(servicio.tipo)
              const estadoInfo = getEstadoBadge(servicio.estado)
              return (
                <div key={servicio.servicioId} className="servicio-item">
                  <div className="servicio-item-header">
                    <span className="servicio-tipo-icon">{tipoInfo.icon}</span>
                    <div className="servicio-item-info">
                      <h4>{servicio.titulo}</h4>
                      <p>{servicio.descripcion}</p>
                    </div>
                    <span className="servicio-estado-badge" style={{ background: estadoInfo.color }}>
                      {estadoInfo.label}
                    </span>
                  </div>
                  <div className="servicio-item-details">
                    <span>📅 {new Date(servicio.fecha).toLocaleDateString('es-CO')}</span>
                    <span>⏱️ {servicio.horas} horas</span>
                    <span>📍 {servicio.ubicacion}</span>
                    <span>📍 {servicio.municipio}, {servicio.departamento}</span>
                  </div>
                  {servicio.validadorNombre && (
                    <div className="servicio-validation">
                      Validado por: {servicio.validadorNombre}
                      {servicio.comentarioValidacion && (
                        <p>"{servicio.comentarioValidacion}"</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
