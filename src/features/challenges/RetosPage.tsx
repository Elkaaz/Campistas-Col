import { useState } from 'react'
import RetoCard from '../../components/cards/RetoCard'
import { Reto } from '../../types'
import '../../styles/pages.css'

/**
 * RetosPage - Lista de retos disponibles (NUEVA VERSIÓN)
 * Grid de retos que el usuario puede completar y publicar
 */
export default function RetosPage() {
  const [retos] = useState<Reto[]>([
    {
      retoId: 'reto_1',
      titulo: 'Fogata Segura',
      descripcion: 'Construye una fogata segura siguiendo los protocolos',
      tipo: 'fogata',
      nivelRecomendado: 'Tallo',
      xpRecompensa: 80,
      criteriosEvaluacion:
        'Debe demostrar conocimiento de seguridad, construcción correcta, y apagado seguro',
      imagenReferencia: 'https://via.placeholder.com/300x200',
      estado: 'activo',
      creadoPor: 'admin_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      retoId: 'reto_2',
      titulo: 'Nudo de Escuadra',
      descripcion: 'Domina el arte de hacer nudos técnicos campamentiles',
      tipo: 'nudo',
      nivelRecomendado: 'Semilla',
      xpRecompensa: 60,
      criteriosEvaluacion:
        'Debe hacer correctamente el nudo de escuadra en diferentes grosores de cuerda',
      imagenReferencia: 'https://via.placeholder.com/300x200',
      estado: 'activo',
      creadoPor: 'admin_1',
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
      criteriosEvaluacion:
        'Debe ser funcional, proteger de clima, y estar hecho sin materiales dañinos',
      imagenReferencia: 'https://via.placeholder.com/300x200',
      estado: 'activo',
      creadoPor: 'admin_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      retoId: 'reto_4',
      titulo: 'Huerta Comunitaria',
      descripcion: 'Ayuda a crear o mantener una huerta comunitaria',
      tipo: 'huerta',
      nivelRecomendado: 'Raíz',
      xpRecompensa: 70,
      criteriosEvaluacion: 'Debe participar en siembra, cuidado, o cosecha de plantas',
      imagenReferencia: 'https://via.placeholder.com/300x200',
      estado: 'activo',
      creadoPor: 'admin_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      retoId: 'reto_5',
      titulo: 'Primeros Auxilios Básicos',
      descripcion: 'Demuestra conocimiento en primeros auxilios básicos',
      tipo: 'primeros_auxilios',
      nivelRecomendado: 'Flor',
      xpRecompensa: 120,
      criteriosEvaluacion: 'Debe conocer RCP, vendajes, y procedimientos básicos de emergencia',
      imagenReferencia: 'https://via.placeholder.com/300x200',
      estado: 'activo',
      creadoPor: 'admin_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const [loading] = useState(false)

  const handlePublish = (retoId: string) => {
    console.log('Publicar reto:', retoId)
    // TODO: Navegar a PublicarRetoPage
  }

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
