import { useParams } from 'react-router-dom'

/**
 * PublicProfilePage - Perfil público de otro usuario
 */
export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="public-profile-page">
      <h1>👤 Perfil</h1>
      <p>Perfil de usuario: {id}</p>
      {/* TODO: Implementar PublicProfilePage completo */}
    </div>
  )
}
