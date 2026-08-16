import ProfileForm from './ProfileForm'
import ProfileInsignias from './ProfileInsignias'
import { useAuth } from '../../hooks/useAuth'

export default function ProfilePage() {
  const { profile } = useAuth()

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Perfil campista</span>
          <h1>Mi perfil</h1>
        </div>
      </div>

      <div className="card">
        <ProfileForm />
      </div>

      {profile && <ProfileInsignias profile={profile} />}
    </div>
  )
}
