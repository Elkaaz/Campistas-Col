import ProfileForm from './ProfileForm'

export default function ProfilePage() {
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
    </div>
  )
}
