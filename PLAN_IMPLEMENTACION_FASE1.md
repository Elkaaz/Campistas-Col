# 🚀 PLAN DE IMPLEMENTACIÓN - FASE 1
## De App Gamificada a Red Social Gamificada

---

## 📋 OBJETIVO GENERAL
Transformar el Firebase en una plataforma de red social gamificada con paridad funcional con el Django, mejorando la experiencia del usuario a través de interacciones sociales, feed dinámico y navegación intuitiva.

---

## 📅 TIMELINE TOTAL: 3-4 SEMANAS

```
SEMANA 1:  Setup + Componentes Base
SEMANA 2:  Nuevas Páginas
SEMANA 3:  Integración Firestore
SEMANA 4:  Testing + Deploy
```

---

## 🎯 FASE 1: SETUP Y ARQUITECTURA (2-3 DÍAS)

### 1.1 Reorganizar estructura de carpetas

```
campistas-firebase/src/
├── components/              (NUEVA)
│   ├── common/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LoadingSpinner.tsx
│   ├── cards/
│   │   ├── PostCard.tsx
│   │   ├── RetoCard.tsx
│   │   ├── CartillaCard.tsx
│   │   ├── PerfilMiniCard.tsx
│   │   └── LeaderboardItem.tsx
│   ├── sections/
│   │   ├── HubNavigation.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── StatsGrid.tsx
│   │   └── FilterPills.tsx
│   └── forms/
│       ├── PublicationForm.tsx
│       ├── ProfileForm.tsx (mejorado)
│       └── FilterForm.tsx
├── features/
│   ├── auth/               (existente - mejorar)
│   ├── social/             (NUEVA)
│   │   ├── HomePage.tsx (El Fogón)
│   │   ├── PublicProfilePage.tsx
│   │   ├── BosqueLocalPage.tsx
│   │   └── services/
│   │       └── socialService.ts
│   ├── learning/           (NUEVA)
│   │   ├── CartillasPage.tsx
│   │   ├── CartillaDetailPage.tsx
│   │   ├── QuizzesPage.tsx
│   │   ├── QuizDetailPage.tsx
│   │   └── services/
│   │       └── learningService.ts
│   ├── levels/             (NUEVA)
│   │   ├── NivelesPage.tsx
│   │   └── services/
│   │       └── levelService.ts
│   ├── challenges/         (existente - mejorar)
│   │   ├── RetosPage.tsx
│   │   ├── PublicarRetoPage.tsx
│   │   ├── HistorialRetosPage.tsx
│   │   └── services/
│   │       └── challengesService.ts
│   ├── leaderboard/        (NUEVA)
│   │   ├── LeaderboardPage.tsx
│   │   ├── LeaderboardLocalPage.tsx
│   │   └── services/
│   │       └── leaderboardService.ts
│   ├── profile/            (existente - mejorar)
│   │   ├── MyProfilePage.tsx
│   │   ├── EditProfilePage.tsx
│   │   ├── ProfileSection.tsx
│   │   └── services/
│   │       └── profileService.ts
│   └── admin/              (existente - mejorar)
│       ├── AdminPage.tsx
│       ├── ValidarRetosPage.tsx
│       └── services/
│           └── adminService.ts
├── layout/                 (NUEVA)
│   ├── AppShell.tsx
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── styles/                 (REORGANIZADA)
│   ├── base.css
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── components.css
│   ├── responsive.css
│   └── utilities.css
├── lib/                    (EXISTENTE - AMPLIAR)
│   ├── levels.ts
│   ├── colors.ts           (NUEVO)
│   ├── constants.ts        (NUEVO)
│   └── formatters.ts       (NUEVO)
├── services/               (EXISTENTE - AMPLIAR)
│   ├── authService.ts
│   ├── postsService.ts     (NUEVO)
│   ├── interactionsService.ts (NUEVO)
│   ├── cartillasService.ts (NUEVO)
│   ├── leaderboardService.ts (MEJORADO)
│   ├── profileService.ts   (MEJORADO)
│   └── seedService.ts      (NUEVO)
├── types/                  (EXISTENTE - AMPLIAR)
│   ├── post.ts             (NUEVO)
│   ├── interaction.ts      (NUEVO)
│   ├── cartilla.ts         (NUEVO)
│   ├── level.ts            (NUEVO)
│   ├── user.ts             (MEJORADO)
│   └── index.ts            (NUEVO)
├── hooks/                  (NUEVO)
│   ├── usePosts.ts
│   ├── useInteractions.ts
│   ├── useUser.ts
│   ├── useLeaderboard.ts
│   └── useCartillas.ts
├── App.tsx                 (MEJORADO)
├── main.tsx
└── firebase.ts
```

### 1.2 Crear tipos TypeScript (types/index.ts)

```typescript
// types/user.ts
export interface User {
  uid: string;
  displayName: string;
  email: string;
  avatar?: string;
  xpTotal: number;
  nivelActual: 'semilla' | 'raiz' | 'tallo' | 'hoja' | 'flor' | 'fruto';
  nivelOrden: number;
  departamento: string;
  municipio: string;
  nombreBosque: string;
  tipoSangre: string;
  eps: string;
  rol: 'campista' | 'lider_bosque' | 'comite_departamental';
  esLider: boolean;
  biografia?: string;
  habilidadEspecial?: string;
  perfilCompleto: boolean;
  cartillasCompletadas: number;
  cartillasTotal: number;
  retosPublicados: number;
  retosValidados: number;
  createdAt: Date;
  updatedAt: Date;
}

// types/post.ts
export interface Post {
  postId: string;
  uid: string;
  autoresNombre: string;
  autoresAvatar: string;
  autoresNivel: string;
  autoresNivelColor: string;
  retoId: string;
  retoTitulo: string;
  retoTipo: 'nudo' | 'refugio' | 'fogata' | 'huerta' | 'primeros_auxilios';
  titulo: string;
  descripcion: string;
  imagenes: string[];
  estado: 'pendiente_validacion' | 'validado' | 'rechazado';
  validadorUid?: string;
  validadorNombre?: string;
  xpAsignado: number;
  contadorFogatas: number;
  contadorNudos: number;
  contadorComentarios: number;
  municipio: string;
  departamento: string;
  createdAt: Date;
  updatedAt: Date;
}

// types/interaction.ts
export interface Interaction {
  interactionId: string;
  uid: string;
  usuarioNombre: string;
  postId: string;
  tipo: 'fogata' | 'nudo';
  createdAt: Date;
}

// types/cartilla.ts
export interface Cartilla {
  cartillaId: string;
  nombre: string;
  slug: string;
  descripcion: string;
  contenido: string;
  nivel: string;
  categoria: string;
  icono: string;
  colorTema: string;
  imagenPortada?: string;
  orden: number;
  competidosTotal: number;
  createdAt: Date;
}

// types/level.ts
export interface Level {
  id: 'semilla' | 'raiz' | 'tallo' | 'hoja' | 'flor' | 'fruto';
  orden: number;
  nombre: string;
  descripcion: string;
  color: string;
  colorSecundario: string;
  icono: string;
  xpRequerida: number;
  xpParaSiguiente: number;
}
```

### 1.3 Crear constants (lib/constants.ts)

```typescript
export const LEVELS: Record<string, Level> = {
  semilla: {
    id: 'semilla',
    orden: 1,
    nombre: 'Semilla',
    descripcion: 'Aspirante nuevo, recién iniciando',
    color: '#8B7355',
    colorSecundario: '#D2B48C',
    icono: '🌱',
    xpRequerida: 0,
    xpParaSiguiente: 500,
  },
  raiz: {
    id: 'raiz',
    orden: 2,
    nombre: 'Raíz',
    descripcion: 'Consolidando tu base',
    color: '#654321',
    colorSecundario: '#8B7355',
    icono: '🪴',
    xpRequerida: 500,
    xpParaSiguiente: 1500,
  },
  tallo: {
    id: 'tallo',
    orden: 3,
    nombre: 'Tallo',
    descripcion: 'Creciendo constantemente',
    color: '#228B22',
    colorSecundario: '#32CD32',
    icono: '🌿',
    xpRequerida: 1500,
    xpParaSiguiente: 3500,
  },
  hoja: {
    id: 'hoja',
    orden: 4,
    nombre: 'Hoja',
    descripcion: 'Expandiendo tus habilidades',
    color: '#32CD32',
    colorSecundario: '#7FFF00',
    icono: '🍃',
    xpRequerida: 3500,
    xpParaSiguiente: 7500,
  },
  flor: {
    id: 'flor',
    orden: 5,
    nombre: 'Flor',
    descripcion: 'Floreciendo en madurez',
    color: '#FF69B4',
    colorSecundario: '#FFB6C1',
    icono: '🌸',
    xpRequerida: 7500,
    xpParaSiguiente: 15000,
  },
  fruto: {
    id: 'fruto',
    orden: 6,
    nombre: 'Fruto',
    descripcion: 'Máximo nivel de excelencia',
    color: '#FF4500',
    colorSecundario: '#FFD700',
    icono: '🍎',
    xpRequerida: 15000,
    xpParaSiguiente: 999999,
  },
};

export const RETO_TYPES = {
  nudo: { icon: '🪢', label: 'Nudo', color: '#8B4513' },
  refugio: { icon: '🏕️', label: 'Refugio', color: '#654321' },
  fogata: { icon: '🔥', label: 'Fogata', color: '#FF4500' },
  huerta: { icon: '🌱', label: 'Huerta', color: '#228B22' },
  primeros_auxilios: { icon: '🚑', label: 'Primeros Auxilios', color: '#E74C3C' },
};

export const NAV_ITEMS = [
  { label: 'El Fogón 🔥', to: '/', icon: '🔥' },
  { label: 'Mi Bosque 🌳', to: '/bosque', icon: '🌳' },
  { label: 'Mi Aprendizaje 📚', to: '/cartillas', icon: '📚' },
  { label: 'Retos ⛰️', to: '/retos', icon: '⛰️' },
  { label: 'Niveles 🎖️', to: '/niveles', icon: '🎖️' },
  { label: 'Leaderboard 🏆', to: '/leaderboard', icon: '🏆' },
];
```

### 1.4 Actualizar App.tsx con nuevas rutas

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'

// Auth
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import CompletarPerfilPage from './features/auth/CompletarPerfilPage'

// Social
import HomePage from './features/social/HomePage'
import PublicProfilePage from './features/social/PublicProfilePage'
import BosqueLocalPage from './features/social/BosqueLocalPage'

// Learning
import CartillasPage from './features/learning/CartillasPage'
import CartillaDetailPage from './features/learning/CartillaDetailPage'
import QuizzesPage from './features/learning/QuizzesPage'
import QuizDetailPage from './features/learning/QuizDetailPage'

// Levels
import NivelesPage from './features/levels/NivelesPage'

// Challenges
import RetosPage from './features/challenges/RetosPage'
import PublicarRetoPage from './features/challenges/PublicarRetoPage'
import HistorialRetosPage from './features/challenges/HistorialRetosPage'

// Leaderboard
import LeaderboardPage from './features/leaderboard/LeaderboardPage'
import LeaderboardLocalPage from './features/leaderboard/LeaderboardLocalPage'

// Profile
import MyProfilePage from './features/profile/MyProfilePage'
import EditProfilePage from './features/profile/EditProfilePage'

// Admin
import AdminPage from './features/admin/AdminPage'
import ValidarRetosPage from './features/admin/ValidarRetosPage'

export default function App() {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/completar-perfil" element={<CompletarPerfilPage />} />
      </Route>

      {/* MAIN APP ROUTES */}
      <Route element={<MainLayout />}>
        {/* Social */}
        <Route path="/" element={<HomePage />} />
        <Route path="/perfiles/:id" element={<PublicProfilePage />} />
        <Route path="/bosque" element={<BosqueLocalPage />} />

        {/* Learning */}
        <Route path="/cartillas" element={<CartillasPage />} />
        <Route path="/cartillas/:slug" element={<CartillaDetailPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/quizzes/:id" element={<QuizDetailPage />} />

        {/* Levels */}
        <Route path="/niveles" element={<NivelesPage />} />

        {/* Challenges */}
        <Route path="/retos" element={<RetosPage />} />
        <Route path="/retos/:id/publicar" element={<PublicarRetoPage />} />
        <Route path="/retos/historial" element={<HistorialRetosPage />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/leaderboard/local" element={<LeaderboardLocalPage />} />

        {/* Profile */}
        <Route path="/mi-perfil" element={<MyProfilePage />} />
        <Route path="/mi-perfil/editar" element={<EditProfilePage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/validar" element={<ValidarRetosPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

---

## 🎨 FASE 2: COMPONENTES BASE (3-4 DÍAS)

### 2.1 Navbar mejorado (components/common/Navbar.tsx)

```typescript
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuth'
import { NAV_ITEMS } from '../../lib/constants'
import { LEVELS } from '../../lib/constants'
import '../styles/navbar.css'

export default function Navbar() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  
  if (!user?.perfilCompleto) return null

  const currentLevel = LEVELS[user.nivelActual]

  return (
    <nav className="navbar" style={{ borderTop: `4px solid ${currentLevel?.color}` }}>
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          🏕️ Campistas Col
        </Link>
      </div>

      <div className="navbar-items">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-item"
            onClick={() => navigate(item.to)}
          >
            {item.label}
          </Link>
        ))}
        
        {user.esLider && (
          <Link to="/admin" className="nav-item nav-leader">
            👑 Panel Líder
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <button className="user-button" onClick={() => navigate('/mi-perfil')}>
          <img src={user.avatar} alt={user.displayName} className="user-avatar" />
          <span>{user.displayName}</span>
        </button>
        <button className="logout-button" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  )
}
```

### 2.2 Crear Layout Principal (layout/MainLayout.tsx)

```typescript
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import '../styles/layout.css'

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
```

### 2.3 Crear Componentes de Cards

**PostCard (components/cards/PostCard.tsx):**
```typescript
import { Post, Interaction } from '../../types'
import '../../styles/cards.css'

interface PostCardProps {
  post: Post
  onFogata: (postId: string) => void
  onNudo: (postId: string) => void
  userHasFogata?: boolean
  userHasNudo?: boolean
}

export default function PostCard({
  post,
  onFogata,
  onNudo,
  userHasFogata = false,
  userHasNudo = false,
}: PostCardProps) {
  return (
    <article className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.autoresAvatar}
            alt={post.autoresNombre}
            className="author-avatar"
            style={{ borderColor: post.autoresNivelColor }}
          />
          <div className="author-info">
            <strong>{post.autoresNombre}</strong>
            <span className="author-level">{post.autoresNivel}</span>
          </div>
        </div>
        <span className="reto-badge" style={{ backgroundColor: post.retoTipo }}>
          {post.retoTipo}
        </span>
      </div>

      {/* IMAGE */}
      {post.imagenes.length > 0 && (
        <img
          src={post.imagenes[0]}
          alt={post.titulo}
          className="post-image"
        />
      )}

      {/* CONTENT */}
      <div className="post-content">
        <h3>{post.titulo}</h3>
        <p>{post.descripcion}</p>
        {post.estado === 'validado' && (
          <div className="validation-badge">
            ✅ Validado por {post.validadorNombre}
          </div>
        )}
      </div>

      {/* FOOTER - Interacciones */}
      <div className="post-footer">
        <button
          className={`reaction-button ${userHasFogata ? 'active' : ''}`}
          onClick={() => onFogata(post.postId)}
        >
          🔥 {post.contadorFogatas}
        </button>
        <button
          className={`reaction-button ${userHasNudo ? 'active' : ''}`}
          onClick={() => onNudo(post.postId)}
        >
          🪢 {post.contadorNudos}
        </button>
        <button className="reaction-button">
          💬 {post.contadorComentarios}
        </button>
      </div>
    </article>
  )
}
```

---

## 🗄️ FASE 3: SERVICIOS Y FIRESTORE (2-3 DÍAS)

### 3.1 Crear postsService.ts

```typescript
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Post } from '../types'

export const postsService = {
  async getFeedSocial(limitNum = 10): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('estado', '==', 'validado'),
      orderBy('createdAt', 'desc'),
      limit(limitNum)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ ...doc.data(), postId: doc.id } as Post))
  },

  async getPostsByType(type: string, limitNum = 10): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('estado', '==', 'validado'),
      where('retoTipo', '==', type),
      orderBy('createdAt', 'desc'),
      limit(limitNum)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ ...doc.data(), postId: doc.id } as Post))
  },

  async publishPost(postData: Omit<Post, 'postId'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  },

  async validatePost(postId: string, validatorData: any): Promise<void> {
    const postRef = doc(db, 'posts', postId)
    await updateDoc(postRef, {
      estado: 'validado',
      validadorUid: validatorData.validadorUid,
      validadorNombre: validatorData.validadorNombre,
      xpAsignado: validatorData.xpAsignado,
      updatedAt: Timestamp.now(),
    })
  },
}
```

### 3.2 Crear interactionsService.ts

```typescript
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Interaction } from '../types'

export const interactionsService = {
  async addInteraction(
    uid: string,
    postId: string,
    tipo: 'fogata' | 'nudo'
  ): Promise<void> {
    // Verificar si ya existe esta interacción
    const q = query(
      collection(db, 'interactions'),
      where('uid', '==', uid),
      where('postId', '==', postId),
      where('tipo', '==', tipo)
    )
    const existing = await getDocs(q)

    if (existing.empty) {
      await addDoc(collection(db, 'interactions'), {
        uid,
        postId,
        tipo,
        createdAt: Timestamp.now(),
      })
      
      // Incrementar contador en post
      await updateDoc(doc(db, 'posts', postId), {
        [`contador${tipo === 'fogata' ? 'Fogatas' : 'Nudos'}`]: increment(1),
      })
    }
  },

  async removeInteraction(uid: string, postId: string, tipo: string): Promise<void> {
    const q = query(
      collection(db, 'interactions'),
      where('uid', '==', uid),
      where('postId', '==', postId),
      where('tipo', '==', tipo)
    )
    const snapshot = await getDocs(q)
    
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref)
    }

    // Decrementar contador en post
    await updateDoc(doc(db, 'posts', postId), {
      [`contador${tipo === 'fogata' ? 'Fogatas' : 'Nudos'}`]: decrement(1),
    })
  },

  async getUserInteractions(uid: string): Promise<Interaction[]> {
    const q = query(
      collection(db, 'interactions'),
      where('uid', '==', uid)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ ...doc.data(), interactionId: doc.id } as Interaction))
  },
}
```

---

## 📝 RESUMEN FASE 1

### ✅ Tareas Completadas
- [x] Reorganizar estructura de carpetas
- [x] Crear tipos TypeScript
- [x] Actualizar App.tsx con nuevas rutas
- [x] Crear Navbar mejorado
- [x] Crear MainLayout
- [x] Crear componentes de cards (PostCard, RetoCard, etc.)
- [x] Crear servicios Firebase (postsService, interactionsService)

### ⏳ Tareas Pendientes
- [ ] Crear nuevas páginas (HomePage, BosqueLocalPage, etc.)
- [ ] Integrar con Firestore
- [ ] Crear seeders de datos
- [ ] Testing y debugging
- [ ] Deploy

---

## 🚀 SIGUIENTES PASOS

1. **Implementar HomePage (El Fogón)**
   - Feed de posts validados
   - Filtros por tipo de reto
   - Scroll infinito/paginación

2. **Implementar RetosPage mejorada**
   - Grid de retos disponibles
   - Botón para publicar

3. **Implementar ProfilePages**
   - MyProfilePage (mi perfil)
   - PublicProfilePage (perfiles de otros)

4. **Crear seeders de datos**
   - Niveles
   - Cartillas
   - Retos base
   - Usuarios de prueba

5. **Testing y debugging**
   - Verificar queries funcionan
   - Verificar permisos Firestore
   - Testing responsivo

6. **Deploy**
   - `npm run build`
   - `firebase deploy`

---

¿Quieres que comencemos con la implementación? ¿Por cuál fase empezamos?
