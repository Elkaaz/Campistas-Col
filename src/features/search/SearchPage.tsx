import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { searchService, type SearchFilters } from '../../services/searchService'
import { DEPARTAMENTOS } from '../../lib/constants'
import type { CampistaProfile } from '../../types'
import '../../styles/pages.css'

export default function SearchPage() {
  const { user } = useAuth()
  const [campistas, setCampistas] = useState<CampistaProfile[]>([])
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMun, setSelectedMun] = useState('')
  const [selectedNivel, setSelectedNivel] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const loadInitial = async () => {
      const depts = await searchService.getDepartamentos()
      setDepartamentos(depts)
      setLoading(false)
    }
    loadInitial()
  }, [])

  useEffect(() => {
    if (selectedDept) {
      searchService.getMunicipiosByDepartamento(selectedDept).then(setMunicipios)
    } else {
      setMunicipios([])
    }
  }, [selectedDept])

  const handleSearch = async () => {
    setLoading(true)
    setHasSearched(true)
    const filters: SearchFilters = {}
    if (selectedDept) filters.departamento = selectedDept
    if (selectedMun) filters.municipio = selectedMun
    if (selectedNivel) filters.nivel = selectedNivel
    if (searchQuery.trim()) filters.searchQuery = searchQuery.trim()

    const result = await searchService.searchCampistas(filters)
    setCampistas(result.data)
    setLoading(false)
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedDept('')
    setSelectedMun('')
    setSelectedNivel('')
    setCampistas([])
    setHasSearched(false)
  }

  return (
    <div className="search-page">
      <div className="page-header">
        <h1>🔍 Buscar Campistas</h1>
        <p className="page-subtitle">
          Encuentra campistas por región, nivel o nombre
        </p>
      </div>

      {/* ── FILTROS ── */}
      <div className="search-filters">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => { setSelectedDept(e.target.value); setSelectedMun('') }}
          className="search-select"
        >
          <option value="">Todos los departamentos</option>
          {departamentos.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={selectedMun}
          onChange={(e) => setSelectedMun(e.target.value)}
          className="search-select"
          disabled={!selectedDept}
        >
          <option value="">Todos los municipios</option>
          {municipios.map(mun => (
            <option key={mun} value={mun}>{mun}</option>
          ))}
        </select>

        <select
          value={selectedNivel}
          onChange={(e) => setSelectedNivel(e.target.value)}
          className="search-select"
        >
          <option value="">Todos los niveles</option>
          <option value="semilla">🌱 Semilla</option>
          <option value="raiz">🌿 Raíz</option>
          <option value="tallo">🪵 Tallo</option>
          <option value="hoja">🍃 Hoja</option>
          <option value="flor">🌸 Flor</option>
          <option value="fruto">🌳 Fruto</option>
        </select>

        <div className="search-actions">
          <button onClick={handleSearch} className="btn-primary" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          {hasSearched && (
            <button onClick={handleClear} className="btn-secondary">
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── RESULTADOS ── */}
      <div className="search-results">
        {hasSearched && !loading && (
          <p className="search-count">
            {campistas.length} {campistas.length === 1 ? 'campista encontrado' : 'campistas encontrados'}
          </p>
        )}

        {loading ? (
          <div className="loading">
            <p>Buscando campistas...</p>
          </div>
        ) : campistas.length === 0 && hasSearched ? (
          <div className="empty-state">
            <p>No se encontraron campistas con esos criterios</p>
            <p style={{ fontSize: 13, opacity: 0.6 }}>Intenta con otros filtros</p>
          </div>
        ) : (
          <div className="campistas-grid">
            {campistas.map((campista) => {
              const nombre = campista.displayName || `${campista.firstName} ${campista.lastName}`.trim()
              return (
                <Link
                  key={campista.uid}
                  to={`/perfiles/${campista.uid}`}
                  className="campista-search-card"
                >
                  <div className="campista-search-avatar">
                    {campista.avatarUrl ? (
                      <img src={campista.avatarUrl} alt={nombre} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="campista-search-info">
                    <h3>{nombre}</h3>
                    <p>📍 {campista.municipio}{campista.departamento ? `, ${campista.departamento}` : ''}</p>
                    <div className="campista-search-meta">
                      <span className="nivel-badge-small" style={{
                        background: 'var(--color-primary, #2E7D32)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {campista.nivelActual || 'semilla'}
                      </span>
                      <span>⚡ {campista.xpTotal?.toLocaleString() || 0} XP</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
