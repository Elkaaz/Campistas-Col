# ✅ FIREBASE SETUP CHECKLIST

## 🔐 Proyecto Firebase: campistas-col

Ubicación: https://console.firebase.google.com/project/campistas-col/

---

## 📋 CHECKLIST PRE-DEPLOY

### Antes de hacer `firebase deploy`:

- [ ] **1. Proyecto Firebase Creado**
  - Ir a: https://console.firebase.google.com/
  - Crear proyecto: `campistas-col`
  - Región: `us-central1`

- [ ] **2. Billing Habilitado**
  - Firebase Console → Project Settings → Billing
  - Agregar método de pago
  - Plan: Blaze (pay-as-you-go)

- [ ] **3. Firestore Database**
  - Firebase Console → Firestore → Create Database
  - Ubicación: `us-central1`
  - Modo: Native
  - Reglas iniciales: Test mode
  - ✅ Los archivos `firestore.rules` están listos en el proyecto

- [ ] **4. Storage**
  - Firebase Console → Storage → Get Started
  - Ubicación: `us-central1`
  - Reglas iniciales: Test mode
  - ✅ Listo para archivos de usuarios, posts, etc.

- [ ] **5. Authentication**
  - Firebase Console → Authentication → Get Started
  - Sign-in methods:
    - [ ] Email/Password
    - [ ] Google Sign-In
    - [ ] (Opcional) Facebook
    - [ ] (Opcional) Apple

- [ ] **6. Hosting**
  - Firebase Console → Hosting → Get Started
  - ✅ Ya configurado en `firebase.json`

---

## 🛠️ SETUP EN TU MÁQUINA

### Terminal PowerShell:

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"

# Paso 1: Login en Firebase
firebase login

# Paso 2: Verificar conexión
firebase projects:list

# Paso 3: Ver proyecto activo
firebase use

# Paso 4: Hacer deploy
firebase deploy
```

---

## 📝 ARCHIVOS DE CONFIGURACIÓN FIREBASE

### ✅ firebase.json
Configuración de deployment:
- Public: dist/
- Rewrites: Redirige todas las rutas a index.html (SPA)

### ✅ .firebaserc
Proyecto por defecto:
```json
{
  "projects": {
    "default": "campistas-col"
  }
}
```

### ✅ firestore.rules
Reglas de seguridad:
- Posts: Lectura pública, escritura privada
- Users: Lectura pública, edición privada
- Comments: Lectura pública, edición privada

### ✅ firestore.indexes.json
Indexes para queries:
- Feed (timestamp descendente)
- Leaderboard (puntos descendente)
- Búsqueda de usuarios

### ✅ storage.rules (PENDIENTE DE CREAR)
Reglas para Firebase Storage:
- Avatars: Solo usuario puede editar
- Posts: Cualquiera autenticado
- Comments: Cualquiera autenticado

---

## 🚀 DEPLOY STEPS

### Paso 1: Autenticación
```
firebase login
→ Abre navegador
→ Autoriza con tu cuenta Google
→ Vuelve a terminal (Ctrl+C cuando veas "Successfully logged in")
```

### Paso 2: Verificar Proyecto
```
firebase projects:list
→ Debería mostrar: campistas-col (default)
```

### Paso 3: Deploy Completo
```
firebase deploy
→ Desplegará:
  - Hosting (dist/)
  - Firestore rules
  - Firestore indexes
```

### Paso 4: Verificar URL
```
https://campistas-col.web.app/
→ Debe cargar la app
```

---

## 🔧 CONFIGURACIÓN FIRESTORE

### Collections que se crearán automáticamente:

| Collection | Documentos | Uso |
|-----------|-----------|-----|
| `users` | uid → datos usuario | Perfiles |
| `posts` | postId → datos post | Feed |
| `comments` | commentId → datos | Comentarios |
| `leaderboard` | uid → puntos | Ranking |
| `challenges` | challengeId → datos | Desafíos |
| `notifications` | notificationId → datos | Notificaciones |

### Estructura de documentos:

```
users/{uid}
├── email: string
├── nombre: string
├── avatar: URL
├── nivel: string (semilla-honorario)
├── puntos: number
├── badges: array
├── bio: string
└── createdAt: timestamp

posts/{postId}
├── uid: string (autor)
├── titulo: string
├── contenido: string
├── imagen: URL (opcional)
├── likes: number
├── comentarios: number
├── tags: array
└── createdAt: timestamp

comments/{commentId}
├── postId: string
├── uid: string (autor)
├── contenido: string
├── likes: number
└── createdAt: timestamp
```

---

## 🔐 SEGURIDAD - REGLAS

### Firestore Rules (firestore.rules)

Cambiar a producción después del testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts - Públicos para leer, privados para escribir
    match /posts/{document=**} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow update: if resource.data.uid == request.auth.uid;
      allow delete: if resource.data.uid == request.auth.uid;
    }
    
    // Users - Públicos para leer, privados para escribir
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth.uid == uid;
    }
    
    // Comments - Públicos para leer, privados para escribir
    match /comments/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if resource.data.uid == request.auth.uid;
    }
    
    // Leaderboard - Público
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if false; // Solo backend puede actualizar
    }
  }
}
```

---

## 🎯 PRIMERO - Firebase Console Checks

Antes de hacer deploy, verifica en https://console.firebase.google.com/project/campistas-col/:

### Firestore
- [ ] Database creada
- [ ] Ubicación: us-central1
- [ ] Modo: Native
- [ ] Reglas visibles

### Authentication
- [ ] Al menos un proveedor habilitado
- [ ] Usuarios de prueba creados (opcional)

### Storage
- [ ] Storage activado
- [ ] Ubicación: us-central1

### Hosting
- [ ] Dominio asignado (campistas-col.web.app)

---

## 📊 DESPUÉS DEL DEPLOY

### 1. Verificar Hosting
```powershell
firebase hosting:sites:list
```
Debería mostrar:
- URL: https://campistas-col.web.app/

### 2. Ver Logs
```powershell
firebase hosting:logs
```

### 3. Compartir URL
- Sitio público: https://campistas-col.web.app/
- Consola: https://console.firebase.google.com/project/campistas-col/

---

## 🌐 URLS IMPORTANTES

### Producción
- App: https://campistas-col.web.app/
- Alternativa: https://campistas-col.firebaseapp.com/

### Desarrollo
- Local: http://localhost:5173 (npm run dev)

### Firebase Console
- Proyecto: https://console.firebase.google.com/project/campistas-col/
- Firestore: https://console.firebase.google.com/project/campistas-col/firestore
- Auth: https://console.firebase.google.com/project/campistas-col/authentication
- Storage: https://console.firebase.google.com/project/campistas-col/storage
- Hosting: https://console.firebase.google.com/project/campistas-col/hosting

---

## ⚠️ IMPORTANTE

### Para Producción:
1. Cambiar Firestore de "Test mode" a "Production mode"
2. Actualizar reglas de seguridad
3. Habilitar HTTPS (automático)
4. Configurar CORS para API calls

### Para Testing:
1. Crear usuarios de prueba
2. Usar Firestore emulator
3. Usar Auth emulator

---

## 🔄 PRÓXIMO: FASE 5 - AUTENTICACIÓN

Después del deploy, configurar:

1. **LoginPage.tsx**
   - Email/Password form
   - Validación
   - Error handling

2. **SignupPage.tsx**
   - Registro de nuevos usuarios
   - Crear documento en Firestore
   - Assign nivel inicial (semilla)

3. **useAuth.ts Hook**
   - onAuthStateChanged
   - Persistencia de sesión
   - Logout

4. **ProtectedRoutes**
   - Guard para rutas privadas
   - Redirect a login si no autenticado

---

## 📝 TRACKING

**Deploy Date**: [Será completado]
**Status**: Ready for deployment
**Project**: campistas-col
**URL**: https://campistas-col.web.app/

---

## ✅ FINAL CHECKLIST

- [ ] Firebase CLI instalado (`firebase --version`)
- [ ] Logueado en Firebase (`firebase login`)
- [ ] Proyecto campistas-col existe en Firebase
- [ ] Firestore Database creada
- [ ] Authentication configurada
- [ ] Storage habilitado
- [ ] dist/ actualizado (`npm run build`)
- [ ] Firebase rules listos (firestore.rules)
- [ ] Hacer deploy: `firebase deploy`
- [ ] Verificar URL: https://campistas-col.web.app/

**Ready**: ✅ YES - Procede con deploy
