# 🌿 Red Social Gamificada - Jóvenes Campistas Colombianos

Una red social moderna y gamificada construida con **React + TypeScript + Firebase** para conectar a jóvenes campistas colombianos, compartir retos y crecer en comunidad.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

---

## 🎯 Características Principales

### 📱 Interface
- **Navbar mejorado** con navegación intuitiva
- **Layouts responsivos** para móvil y desktop
- **5 componentes de cards** especializadas (Post, Reto, Perfil, Nivel, Cartilla)
- **CSS moderno** con animaciones suaves

### 🔥 Red Social (El Fogón)
- **Feed en tiempo real** - actualizaciones instantáneas con onSnapshot()
- Publicaciones validadas de retos completados
- Filtros por tipo de reto (Nudos, Refugios, Fogatas, Huertas, Primeros Auxilios)
- Reacciones con emojis: 🔥 (Fogata) y 🪢 (Nudo)
- **Comentarios en vivo** - nuevos comentarios aparecen al instante
- Contador de interacciones en tiempo real

### 🏆 Sistema de Gamificación
- **6 Niveles** progresivos: Semilla → Raíz → Tallo → Hoja → Flor → Fruto
- **Experiencia (XP)** que otorgan los retos validados
- **Leaderboard global en tiempo real** - actualización instantánea de rankings
- **Leaderboard local** por municipio
- **Medallas** para top 3 usuarios (🥇🥈🥉)

### 🎖️ Sistema de Retos Validados
- **5 tipos de retos**: Fogata, Nudo, Refugio, Huerta, Primeros Auxilios
- **Publicación de evidencia** con fotos/videos vía Cloudinary
- **Validación por líderes/admins** con asignación automática de XP
- **Comentarios en evaluación** para feedback al campista
- **Panel de admin en tiempo real** - retos pendientes actualizan al instante
- Notificaciones automáticas a usuarios cuando sus retos son validados

### 📚 Cartillas de Formación
- **8 cartillas** de temas campamentiles
- Progreso individual por usuario
- Estados: Bloqueada, En progreso, Completada
- Vínculos a PDFs y recursos externos

### 👥 Comunidades Locales
- **Bosques locales** por municipio/departamento
- Ranking local de campistas
- Comunicación dentro de la comunidad
- Eventos y actividades por zona

---

## 🏗️ Arquitectura

```
campistas-firebase/
├── src/
│   ├── components/
│   │   ├── cards/           # 5 componentes de cards
│   │   ├── common/          # Navbar, Layout
│   │   └── index.ts
│   ├── features/            # Páginas por sección
│   │   ├── social/          # HomePage (El Fogón)
│   │   ├── challenges/      # RetosPage, PublicarRetoPage
│   │   ├── leaderboard/     # LeaderboardPage
│   │   ├── profile/         # ProfilePages
│   │   ├── bosque/          # BosqueLocalPage
│   │   └── auth/            # LoginPage
│   ├── layout/              # MainLayout, AuthLayout
│   ├── lib/                 # Constants, colors, helpers
│   ├── services/            # Firebase services
│   │   ├── postsService.ts
│   │   ├── profileService.ts
│   │   ├── interactionsService.ts
│   │   └── index.ts
│   ├── styles/              # CSS global y por componente
│   ├── types/               # TypeScript interfaces
│   ├── firebase.ts          # Configuración Firebase
│   ├── App.tsx              # Rutas principales
│   └── main.tsx
├── seeders/                 # Scripts para cargar datos
│   ├── seed-all.mjs
│   ├── seed-levels.mjs
│   ├── seed-retos.mjs
│   ├── seed-cartillas.mjs
│   ├── seed-municipios.mjs
│   └── README.md
├── FIRESTORE_SCHEMA.md      # Estructura de datos
├── TESTING.md               # Casos de prueba
├── DEPLOYMENT.md            # Guía de deploy
├── firebase.json            # Configuración Firebase
├── vite.config.ts           # Configuración Vite
└── package.json             # Dependencias
```

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Proyecto Firebase creado
- Firestore habilitado

### Instalación

```bash
# 1. Clonar repositorio
cd campistas-firebase

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase
# Crear archivo .env con credenciales:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=campistas-col
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# 4. Cargar datos iniciales
node seeders/seed-all.mjs

# 5. Iniciar servidor de desarrollo
npm run dev
```

### URLs Locales
```
Desarrollo:  http://localhost:5173
Preview:     npm run preview
```

---

## 📖 Documentación

### Documentos Incluidos

- **FIRESTORE_SCHEMA.md** - Estructura completa de Firestore
- **TESTING.md** - Casos de prueba y debugging
- **DEPLOYMENT.md** - Guía de deploy a producción
- **seeders/README.md** - Cómo cargar datos iniciales

### Rutas de la App

```
/                   → HomePage (El Fogón - Feed social)
/leaderboard        → LeaderboardPage (Ranking global)
/leaderboard/local  → LeaderboardLocalPage (Por municipio)
/retos              → RetosPage (Catálogo de retos)
/retos/:id/publicar → PublicarRetoPage (Publicar reto completado)
/profile/:uid       → PublicProfilePage (Perfil de usuario)
/bosque             → BosqueLocalPage (Comunidad local)
/login              → LoginPage (Autenticación)
```

---

## 🔧 Tecnología Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (2.8s build time)
- **React Router** - Routing
- **CSS3** - Styling (sin frameworks, CSS puro)

### Backend (Firebase)
- **Firestore** - Base de datos NoSQL con real-time listeners
- **Firebase Auth** - Autenticación email/password + Google
- **Cloud Storage** (via Cloudinary) - Almacenamiento de imágenes (avatars, evidencia retos)
- **Firestore Rules** - Seguridad y permisos por rol

### DevTools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **npm/yarn** - Package management

---

## 📊 Datos y Servicios

### Colecciones Firestore
- `profiles/` - Perfiles de usuarios
- `posts/` - Publicaciones de retos
- `interactions/` - Reacciones (🔥🪢)
- `levels/` - Sistema de niveles
- `retos/` - Retos disponibles
- `cartillas/` - Materiales de formación
- `municipios/` - Comunidades locales

### Servicios Firebase
```typescript
// Posts (con real-time listeners)
postsService.subscribeFeedSocial(callback)        // Feed en vivo
postsService.subscribePostsByType(type, callback) // Por categoría
postsService.subscribePendingPosts(callback)      // Retos pendientes (admin)
postsService.validatePost(postId, uid, xp, comentario)  // Validar reto
postsService.rejectPost(postId, uid, comentario)       // Rechazar reto

// Comments (con real-time listeners)
commentsService.subscribeCommentsByPostId(postId, callback)  // Comentarios en vivo

// Notifications (con real-time listeners)
notificationsService.subscribeNotifications(uid, callback)  // Todas
notificationsService.subscribeUnreadNotifications(uid, callback)  // No leídas

// Leaderboard (con real-time listeners)
profileService.subscribeLeaderboard(callback)    // Ranking global en vivo

// Interacciones
interactionsService.addInteraction(uid, nombre, avatar, postId, tipo)
interactionsService.removeInteraction(...)

// Perfiles
profileService.getProfileByUid(uid)
profileService.addXp(uid, amount)  // Aumenta XP y actualiza nivel
profileService.updateProfile(uid, updates)
```

---

## 🎨 Diseño Visual

### Color Palette
```
Primario:       #228B22 (Verde - Naturaleza)
Secundario:     #FF4500 (Naranja - Fuego)
Terciario:      #8B7355 (Marrón - Tierra)
Acento:         #FFD700 (Oro - Éxito)
Background:     #F5F5F5 (Gris claro)
```

### Niveles y Colores
```
🌱 Semilla      #8B7355
🌿 Raíz         #654321
🌾 Tallo        #228B22
🍃 Hoja         #2E8B57
🌸 Flor         #FF1493
🍎 Fruto        #FF4500
```

---

## 📈 Estadísticas del Proyecto

- **Componentes**: 5 cards + layouts + páginas
- **Servicios**: 3 servicios Firebase con 18+ métodos
- **Tipos**: 10+ interfaces TypeScript
- **Páginas**: 7 rutas principales
- **Build Size**: 813.98 KB gzipped (215.90 KB)
- **Build Time**: 7.62s
- **LOC**: ~9000 líneas de código

---

## ✅ Checklist de Completación

### FASE 1 - Setup y Arquitectura
- [x] Estructura de carpetas
- [x] Tipos TypeScript
- [x] Constants y helpers
- [x] Layouts base
- [x] Navbar mejorado

### FASE 2 - Componentes y Páginas
- [x] 5 Cards especializadas
- [x] HomePage (El Fogón)
- [x] RetosPage y PublicarRetoPage
- [x] LeaderboardPage
- [x] ProfilePages
- [x] CSS profesional

### FASE 3 - Servicios y Datos
- [x] 3 Servicios Firebase (Posts, Interactions, Profiles)
- [x] Schema Firestore completo
- [x] Seeders para datos iniciales
- [x] Firestore Rules de seguridad

### FASE 4 - Testing y Deploy
- [x] Testing exhaustivo con casos de uso
- [x] Servicios conectados a páginas
- [x] Documentación completa
- [x] Deploy a Firebase Hosting

### FASE 5-9 - Real-time Features y Validación
- [x] Real-time listeners (onSnapshot) en HomePage, Leaderboard, Comments, Notifications
- [x] Avatar upload con Cloudinary
- [x] Evidence upload en PublicarRetoPage
- [x] AdminPage rediseñado con real-time retos pendientes
- [x] Sistema de validación: aprobar/rechazar retos con comentarios
- [x] XP automático: asignación y actualización de niveles
- [x] Notificaciones en tiempo real

---

## 🚀 Deploy

```bash
# Build para producción
npm run build

# Verificar preview
npm run preview

# Deploy a Firebase
firebase deploy

# URL en vivo
https://campistas-col.web.app
```

---

## 📞 Contacto y Soporte

- **Firebase Console**: https://console.firebase.google.com
- **Documentación React**: https://react.dev
- **Firebase Docs**: https://firebase.google.com/docs

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT** - ver LICENSE para detalles.

---

## 🎯 Contribución

Las contribuciones son bienvenidas. Para cambios principales:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🌱 Visión del Proyecto

Crear una plataforma digital que empodere a jóvenes campistas colombianos a:
- ✅ Conectarse con otros campistas
- ✅ Completar retos y ganar experiencia
- ✅ Crecer en liderazgo y habilidades
- ✅ Fortalecer la comunidad campista
- ✅ Preservar la tradición campamentil

---

**Red Social Gamificada para Jóvenes Campistas Colombianos**

Construida con ❤️ para la comunidad campista

*Agosto 2026 - Versión 1.0.0*

---

✅ **GitHub Actions Deploy Configurado** - Deploy automático en cada push a main
