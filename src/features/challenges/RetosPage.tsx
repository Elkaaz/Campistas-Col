import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RetoCard from '../../components/cards/RetoCard'
import { useAuth } from '../../hooks/useAuth'
import { getRetos, type Reto as RetoFS } from '../../services/retosService'
import type { Reto } from '../../types'
import '../../styles/pages.css'

// Mapa de dificultad -> nivel recomendado
const DIFICULTAD_NIVEL: Record<string, string> = {
  facil: 'Semilla',
  medio: 'Tallo',
  dificil: 'Hoja',
}

// Mapa de categoria -> tipo visual
const CATEGORIA_TIPO: Record<string, string> = {
  fogata: 'fogata',
  nudos: 'nudo',
  refugio: 'refugio',
  huerta: 'huerta',
  primeros_auxilios: 'primeros_auxilios',
  ambiental: 'ambiental',
  liderazgo: 'liderazgo',
  servicio: 'servicio',
}

function fsRetoToReto(r: RetoFS): Reto {
  return {
    retoId: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    tipo: (CATEGORIA_TIPO[r.categoria] || r.categoria) as any,
    nivelRecomendado: DIFICULTAD_NIVEL[r.dificultad] || 'Semilla',
    xpRecompensa: r.xpRecompensa,
    criteriosEvaluacion: r.requiereValidacion
      ? 'Requiere validacion por lider de bosque'
      : 'Autoevaluacion',
    imagenReferencia: undefined,
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.createdAt),
  }
}

// Retos de fallback si Firestore no tiene datos aun
const RETOS_FALLBACK: Reto[] = [
  {
    retoId: 'reto_1',
    titulo: 'Fogata Segura',
    descripcion: 'Construye una fogata segura siguiendo los protocolos del movimiento',
    tipo: 'fogata',
    nivelRecomendado: 'Tallo',
    xpRecompensa: 80,
    criteriosEvaluacion: 'Demuestra seguridad, construccion correcta y apagado',
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    retoId: 'reto_2',
    titulo: 'Nudo de Escuadra',
    descripcion: 'Domina el arte de los nudos tecnicos campamentiles',
    tipo: 'nudo',
    nivelRecomendado: 'Semilla',
    xpRecompensa: 60,
    criteriosEvaluacion: 'Haz el nudo correctamente en diferentes grosores',
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    retoId: 'reto_3',
    titulo: 'Refugio de Emergencia',
    descripcion: 'Construye un refugio de emergencia usando recursos naturales',
    tipo: 'refugio',
    nivelRecomendado: 'Hoja',
    xpRecompensa: 100,
    criteriosEvaluacion: 'Funcional, protege del clima, sin materiales daninos',
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    retoId: 'reto_4',
    titulo: 'Huerta Comunitaria',
    descripcion: 'Participa en la creacion o mantenimiento de una huerta comunitaria',
    tipo: 'huerta',
    nivelRecomendado: 'Raíz',
    xpRecompensa: 70,
    criteriosEvaluacion: 'Siembra, cuidado o cosecha documentada',
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    retoId: 'reto_5',
    titulo: 'Primeros Auxilios Basicos',
    descripcion: 'Demuestra conocimiento en primeros auxilios basicos',
    tipo: 'primeros_auxilios',
    nivelRecomendado: 'Flor',
    xpRecompensa: 120,
    criteriosEvaluacion: 'RCP, vendajes y procedimientos de emergencia',
    estado: 'activo',
    creadoPor: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function RetosPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [retos, setRetos] = useState<Reto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const data = await getRetos()
        if (data.length > 0) {
          setRetos(data.map(fsRetoToReto))
        } else {
          // Si Firestore esta vacio, mostrar retos por defecto
          setRetos(RETOS_FALLBACK)
        }
      } catch (err) {
        console.error('[RetosPage]', err)
        setError('Error cargando retos. Mostrando retos de ejemplo.')
        setRetos(RETOS_FALLBACK)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const handlePublish = (retoId: string) => {
    if (!user) {
      navigate('/auth')
      return
    }
    navigate(`/retos/${retoId}/publicar`)
  }

  return (
    <div className="retos-page">
      {/* HEADER */}
      <div className="page-header">
        <h1>⛰️ Retos Disponibles</h1>
        <p className="page-subtitle">
          Completa retos para ganar XP y subir de nivel
          {!user && (
            <> · <a href="/auth" style={{ color: 'var(--color-accent)' }}>Inicia sesion para publicar</a></>
          )}
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#fcd34d',
          fontSize: 13,
          margin: '0 0 16px',
        }}>
          ⚠️ {error}
        </div>
      )}

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
