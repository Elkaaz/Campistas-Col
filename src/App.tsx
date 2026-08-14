import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'

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

// LEARNING (STUB)
import DashboardPage from './features/dashboard/DashboardPage'

// PROFILE
import ProfilePage from './features/profile/ProfilePage'

// ADMIN
import AdminPage from './features/admin/AdminPage'

export default function App() {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* MAIN APP ROUTES */}
      <Route element={<MainLayout />}>
        {/* SOCIAL */}
        <Route path="/" element={<HomePage />} />
        <Route path="/perfiles/:id" element={<PublicProfilePage />} />
        <Route path="/bosque" element={<BosqueLocalPage />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/leaderboard/local" element={<LeaderboardLocalPage />} />

        {/* CHALLENGES */}
        <Route path="/retos" element={<RetosPage />} />
        <Route path="/retos/:id/publicar" element={<PublicarRetoPage />} />

        {/* LEGACY ROUTES - TO BE REORGANIZED */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mi-perfil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
