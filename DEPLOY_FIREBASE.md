# 🚀 DEPLOY A FIREBASE - GUÍA COMPLETA

## Estado Actual

✅ Build: Generado (dist/ - 260.1 MB, 32 archivos)
✅ Firebase Config: Configurado (firebase.json, .firebaserc)
✅ Firestore: Configurado (firestore.rules, firestore.indexes.json)
✅ Proyecto Firebase: campistas-col

---

## 📋 PASOS PARA DEPLOY

### Paso 1: Autenticación en Firebase

En tu terminal PowerShell:

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"

# Ejecutar login
firebase login

# Se abrirá navegador para autenticar con tu cuenta Google
# Una vez autorizado, cierra el navegador
```

**Nota**: Usa tu cuenta Google vinculada al proyecto Firebase "campistas-col"

---

### Paso 2: Verificar Proyecto

```powershell
# Listar proyectos disponibles
firebase projects:list

# Debería mostrar: campistas-col (ACTIVE)
```

---

### Paso 3: Deploy a Hosting

```powershell
# Deploy del sitio
firebase deploy

# Desplegará:
# - public/images/ → Firebase Hosting
# - public/docs/ → Firebase Hosting
# - dist/ → Red Campista Col web app
```

**Tiempo esperado**: 2-5 minutos

---

### Paso 4: Verificar Deploy

```powershell
# Ver estado del deploy
firebase hosting:sites:list

# Debería mostrar:
# - Hosting URL: https://campistas-col.web.app
# - Preview URL: https://campistas-col--[branch].web.app
```

---

## 🔧 CONFIGURACIÓN FIREBASE REQUIERIDA

### 1. Firestore Database
**Status**: ✅ Configurado en Firebase Console

```
Ubicación: us-central1
Modo: Firestore Native
Reglas: firestore.rules
```

### 2. Firestore Rules (Seguridad)

Archivo: `firestore.rules`

Contiene:
```
- Lectura pública de posts
- Escritura solo para usuarios autenticados
- Comentarios solo para usuarios autenticados
- Datos de usuario privados (solo propietario)
- Leaderboard público
- Challenges públicos pero comentarios privados
```

### 3. Firestore Indexes

Archivo: `firestore.indexes.json`

Contiene indexes para:
- Queries de feed (ordenadas por timestamp)
- Búsqueda de usuarios
- Leaderboard (ordenado por puntos)
- Challenges (filtro por estado)

### 4. Storage (Archivos)

**Status**: ✅ Listo para activar

```
firebase storage
├── usuarios/
│   └── {uid}/
│       ├── avatar.jpg
│       ├── banner.jpg
│       └── perfil/
├── posts/
│   ├── {postId}/
│       └── image.jpg
└── comments/
    ├── {commentId}/
        └── image.jpg
```

**Reglas de seguridad**: En `storage.rules` (crear si no existe)

### 5. Authentication

**Status**: ✅ Configurado en Firebase Console

**Métodos habilitados**:
- Email/Password
- Google Sign-In
- Facebook (opcional)
- Apple Sign-In (opcional)

**Configuración**:
- Email verificación: Sí
- Gestión de sesión: Firebase (por defecto)
- Providers: Ver Firebase Console → Authentication → Sign-in method

---

## 📝 PASO A PASO: PRIMERA VEZ

### 1. Terminal PowerShell (En tu máquina)

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"

# Login
firebase login

# Esperar autorización en navegador
# Cierra el navegador cuando veas "Successfully logged in"
```

### 2. Firebase Console (navegador)

Ir a: https://console.firebase.google.com/

Seleccionar proyecto: `campistas-col`

Verificar:
- ✅ Firestore Database (Crear si no existe)
- ✅ Storage (Crear si no existe)
- ✅ Authentication
- ✅ Hosting

### 3. De vuelta en Terminal

```powershell
# Deploy
firebase deploy

# Esperar a que termine
# Mostrará: "Deploy complete!"
# URL: https://campistas-col.web.app
```

---

## 🌐 URLS DESPUÉS DE DEPLOY

### Hosting
```
Production: https://campistas-col.web.app
Sitio web: https://campistas-col.firebaseapp.com
```

### Consola Firebase
```
https://console.firebase.google.com/project/campistas-col/
```

### Firestore
```
https://console.firebase.google.com/project/campistas-col/firestore
```

### Authentication
```
https://console.firebase.google.com/project/campistas-col/authentication
```

### Storage
```
https://console.firebase.google.com/project/campistas-col/storage
```

---

## ✅ DESPUÉS DEL DEPLOY

### 1. Verificar Hosting
```powershell
# Ver último deploy
firebase hosting:channel:list

# Ver logs
firebase hosting:logs [--limit=50]
```

### 2. Activar Firestore
Firebase Console → Firestore → Create Database → Next → Enable

### 3. Activar Storage
Firebase Console → Storage → Get Started → Next → Enable

### 4. Configurar Authentication
Firebase Console → Authentication → Get Started → Enable providers

### 5. Seeding de Datos
```powershell
node seeders/seed-all.mjs

# Cargará datos de prueba en Firestore:
# - 10 usuarios test
# - 20 posts
# - 50 comentarios
# - Leaderboard data
```

---

## 🔐 SEGURIDAD

### Firestore Rules (firestore.rules)

Contenido actual:
```
match /posts/{postId} {
  allow read: if true;                      // Todos pueden leer
  allow create: if request.auth != null;    // Solo usuarios logged in
  allow update: if resource.data.uid == request.auth.uid;  // Solo propietario
  allow delete: if resource.data.uid == request.auth.uid;  // Solo propietario
}

match /users/{uid} {
  allow read: if true;                      // Perfil público
  allow write: if request.auth.uid == uid;  // Solo dueño puede editar
}

match /comments/{commentId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow delete: if resource.data.uid == request.auth.uid;
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes de usuario
    match /usuarios/{uid}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == uid;
    }

    // Posts con imágenes
    match /posts/{postId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Comentarios con imágenes
    match /comments/{commentId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Error: "Not logged in"
```powershell
firebase logout
firebase login
```

### Error: "Project not found"
Verificar `.firebaserc` tiene proyecto correcto:
```json
{
  "projects": {
    "default": "campistas-col"
  }
}
```

### Error: "dist/ not found"
```powershell
npm run build
firebase deploy
```

### Error: "Permission denied"
Verificar en Firebase Console:
- Project settings → Permisos de usuario
- Rol: Editor o superior

### Build size muy grande
```powershell
npm run build
ls -lah dist/
# Usar firebase deploy --only hosting
```

---

## 📊 VERIFICACIÓN POST-DEPLOY

### 1. Sitio Web Disponible
```
https://campistas-col.web.app/
```
✓ Debe cargar la app sin errores

### 2. Imágenes Cargadas
```
https://campistas-col.web.app/images/logos/logo-principal.png
```
✓ Logo debe verse

### 3. PDFs Accesibles
```
https://campistas-col.web.app/docs/CARTILLA-CONCIENCIA-AMBIENTAL.pdf
```
✓ PDF debe ser descargable

### 4. Console Limpia
F12 → Console → No debe haber errores rojo

---

## 🔄 UPDATES FUTUROS

Para actualizar después de cambios:

```powershell
# 1. Build nuevo
npm run build

# 2. Deploy
firebase deploy

# 3. Ver cambios en vivo
# https://campistas-col.web.app/
```

---

## 🗺️ PRÓXIMAS CONFIGURACIONES EN FIREBASE

### 1. Authentication (Fase 5)
- ✅ Email/Password login
- ✅ Google Sign-In
- ✅ Reset password
- ✅ Email verification

### 2. Firestore Database (Fase 6)
- ✅ Colecciones: users, posts, comments, leaderboard, challenges
- ✅ Indexes para queries
- ✅ Seguridad con rules

### 3. Storage (Fase 7)
- ✅ User avatars
- ✅ Post images
- ✅ Profile banners

### 4. Functions (Fase 8)
- ✅ Crear posts (agregar timestamp automático)
- ✅ Contar likes (actualización en tiempo real)
- ✅ Notificaciones
- ✅ Emails

### 5. Analytics (Fase 9)
- ✅ Seguimiento de usuarios
- ✅ Eventos (login, post, comentario)
- ✅ Crash reporting

---

## 💾 BACKUP

Antes de cambios importantes:

```powershell
# Exportar datos de Firestore
gcloud firestore export gs://campistas-col.appspot.com/backup

# Backup de Storage
gsutil -m cp -r gs://campistas-col.appspot.com/** ./backup/
```

---

## ✨ RESUMEN

1. **Login**: `firebase login`
2. **Deploy**: `firebase deploy`
3. **Ver**: https://campistas-col.web.app/
4. **Verificar**: Logs en Firebase Console
5. **Continuar**: Fase 5 Authentication

---

**Status**: Listo para deploy
**Proyecto**: campistas-col
**Ubicación**: https://console.firebase.google.com/project/campistas-col/
**App**: https://campistas-col.web.app/

**Next**: Ejecutar deployment e iniciar Fase 5: Authentication
