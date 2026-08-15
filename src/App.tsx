import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Importar estilos de animaciones
import './styles/animations.css'

// AUTH
import AuthPage from './features/auth/AuthPage'
import LoginPage from './features/auth/LoginPage'

// SOCIAL
import HomePage from './features/social/HomePage'
import PublicProfilePage from './features/profile/PublicProfilePage'
import BosqueLocalPage from './features/bosque/BosqueLocalPage'

// LEADERBOARD
import LeaderboardPage from './features/leaderboard/LeaderboardPage'
import LeaderboardLocalPage from './features/leaderboard/LeaderboardLocalPage'

// CHALLENGES
import RetosPage from './features/challenges/RetosPage'
import PublicarRetoPage from './features/challenges/PublicarRetoPage'

// DASHBOARD
import DashboardPage from './features/dashboard/DashboardPage'

// PROFILE
import ProfilePage from './features/profile/ProfilePage'

// ADMIN
import AdminPage from './features/admin/AdminPage'

export default function App() {
  return (
    <Routes>
      {/* ─── RUTAS PUBLICAS (Auth) ─── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* ─── RUTAS PUBLICAS con layout (se pueden ver sin login) ─── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/leaderboard/local" element={<LeaderboardLocalPage />} />
        <Route path="/retos" element={<RetosPage />} />
        <Route path="/perfiles/:id" element={<PublicProfilePage />} />

        {/* ─── RUTAS PRIVADAS (requieren login) ─── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/bosque" element={<BosqueLocalPage />} />
          <Route path="/retos/:id/publicar" element={<PublicarRetoPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mi-perfil" element={<ProfilePage />} />
        </Route>

        {/* ─── RUTAS PRIVADAS solo ADMIN ─── */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* ─── FALLBACK ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
