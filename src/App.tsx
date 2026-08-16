import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import ConnectionStatus from './components/common/ConnectionStatus'

// Importar estilos de animaciones
import './styles/animations.css'
import './styles/learning.css'
import './styles/search.css'
import './styles/notification.css'
import './styles/notifications-page.css'
import './styles/events.css'
import './styles/servicio.css'
import './styles/dashboard.css'

// AUTH
import AuthPage from './features/auth/AuthPage'
import LoginPage from './features/auth/LoginPage'

// LEARNING
import CartillasPage from './features/learning/CartillasPage'
import CartillaDetailPage from './features/learning/CartillaDetailPage'
import QuizzesPage from './features/learning/QuizzesPage'

// LEARNING - Forzar inclusión en bundle (tree-shaking fix)
if (typeof window === 'undefined') {
  console.log('CartillasPage loaded:', typeof CartillasPage)
  console.log('CartillaDetailPage loaded:', typeof CartillaDetailPage)
  console.log('QuizzesPage loaded:', typeof QuizzesPage)
}

// EVENTS
import EventsPage from './features/events/EventsPage'

// SERVICIO
import ServicioPage from './features/servicio/ServicioPage'

// LANDING
import LandingPage from './features/landing/LandingPage'

// SOCIAL
import HomePage from './features/social/HomePage'
import PublicProfilePage from './features/profile/PublicProfilePage'
import BosqueLocalPage from './features/bosque/BosqueLocalPage'
import PostDetailPage from './features/social/PostDetailPage'
import SearchPage from './features/search/SearchPage'

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

// NOTIFICATIONS
import NotificationsPage from './features/notifications/NotificationsPage'

export default function App() {
  return (
    <>
      <Routes>
        {/* ─── LANDING PAGE (Página de Inicio Premium) ─── */}
        <Route path="/" element={<LandingPage />} />

        {/* ─── RUTAS PUBLICAS (Auth) ─── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* ─── RUTAS PUBLICAS con layout (se pueden ver sin login) ─── */}
        <Route element={<MainLayout />}>
          <Route path="/fogon" element={<HomePage />} />
          <Route path="/fogon/:id" element={<PostDetailPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/eventos" element={<EventsPage />} />
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
            <Route path="/aprendizaje" element={<CartillasPage />} />
            <Route path="/aprendizaje/cartillas/:slug" element={<CartillaDetailPage />} />
            <Route path="/aprendizaje/quizzes" element={<QuizzesPage />} />
            <Route path="/notificaciones" element={<NotificationsPage />} />
            <Route path="/servicio" element={<ServicioPage />} />
          </Route>

          {/* ─── RUTAS PRIVADAS solo ADMIN ─── */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* ─── FALLBACK ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ConnectionStatus />
    </>
  )
}
