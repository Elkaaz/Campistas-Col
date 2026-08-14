# 📊 FIRESTORE SCHEMA - RED SOCIAL GAMIFICADA

Esta es la estructura exacta de colecciones y documentos que debe existir en Firestore.

---

## 🔑 COLECCIONES PRINCIPALES

### 1. `profiles/` - Perfiles de usuarios
**Documento por usuario**

```
profiles/
  └─ {uid}/
     ├─ displayName: "María Gómez"
     ├─ email: "maria@email.com"
     ├─ avatar: "https://cloudinary.com/avatar.jpg"
     ├─ xpTotal: 1320
     ├─ nivelActual: "tallo"
     ├─ nivelOrden: 3
     ├─ departamento: "Antioquia"
     ├─ municipio: "Medellín"
     ├─ nombreBosque: "Bosque del Río Magdalena"
     ├─ tipoSangre: "O+"
     ├─ eps: "SURA"
     ├─ rol: "campista"
     ├─ esLider: false
     ├─ esComiteDeptal: false
     ├─ cartillasCompletadas: 4
     ├─ cartillasTotal: 8
     ├─ quizzesCompletados: 3
     ├─ quizzesTotal: 6
     ├─ retosPublicados: 6
     ├─ retosValidados: 5
     ├─ perfilCompleto: true
     ├─ activo: true
     ├─ createdAt: Timestamp
     └─ updatedAt: Timestamp
```

**Índices:**
- `xpTotal` (desc) para leaderboard
- `municipio` + `activo` para comunidad local

---

### 2. `posts/` - Publicaciones de retos
**Documento por publicación**

```
posts/
  └─ {postId}/
     ├─ uid: "user_123"
     ├─ autoresNombre: "María Gómez"
     ├─ autoresAvatar: "https://..."
     ├─ autoresNivel: "Tallo"
     ├─ autoresNivelColor: "#228B22"
     ├─ retoId: "reto_1"
     ├─ retoTitulo: "Fogata Segura"
     ├─ retoTipo: "fogata"
     ├─ titulo: "Mi primera fogata segura 🔥"
     ├─ descripcion: "Completé el reto en campamento"
     ├─ imagenes: ["https://cdn.com/img1.jpg", "https://cdn.com/img2.jpg"]
     ├─ estado: "validado" // pendiente_validacion | validado | rechazado
     ├─ validadorUid: "lider_1"
     ├─ validadorNombre: "Juan Líder"
     ├─ fechaValidacion: Timestamp
     ├─ comentarioValidacion: "Excelente técnica"
     ├─ xpAsignado: 80
     ├─ contadorFogatas: 12
     ├─ contadorNudos: 3
     ├─ contadorComentarios: 2
     ├─ municipio: "Medellín"
     ├─ departamento: "Antioquia"
     ├─ createdAt: Timestamp
     └─ updatedAt: Timestamp
```

**Índices:**
- `estado` + `createdAt` (desc)
- `retoTipo` + `estado` + `createdAt` (desc)

---

### 3. `interactions/` - Reacciones (Fogatas 🔥 y Nudos 🪢)
**Documento por reacción**

```
interactions/
  └─ {interactionId}/
     ├─ uid: "user_456"
     ├─ usuarioNombre: "Carlos López"
     ├─ usuarioAvatar: "https://..."
     ├─ postId: "post_1"
     ├─ tipo: "fogata" // fogata | nudo
     └─ createdAt: Timestamp
```

**Índices:**
- `postId` + `createdAt`
- `uid` + `createdAt`

---

### 4. `levels/` - Sistema de niveles (6 documentos fijos)
**Documento por nivel**

```
levels/
  ├─ semilla/
  │  ├─ orden: 1
  │  ├─ nombre: "Semilla"
  │  ├─ descripcion: "Aspirante nuevo..."
  │  ├─ color: "#8B7355"
  │  ├─ colorSecundario: "#D2B48C"
  │  ├─ icono: "🌱"
  │  ├─ xpRequerida: 0
  │  └─ xpParaSiguiente: 500
  │
  ├─ raiz/
  │  ├─ orden: 2
  │  ├─ nombre: "Raíz"
  │  ├─ xpRequerida: 500
  │  └─ xpParaSiguiente: 1500
  │
  ├─ tallo/
  │  ├─ orden: 3
  │  ├─ nombre: "Tallo"
  │  ├─ xpRequerida: 1500
  │  └─ xpParaSiguiente: 3500
  │
  ├─ hoja/
  │  ├─ orden: 4
  │  ├─ nombre: "Hoja"
  │  ├─ xpRequerida: 3500
  │  └─ xpParaSiguiente: 7500
  │
  ├─ flor/
  │  ├─ orden: 5
  │  ├─ nombre: "Flor"
  │  ├─ xpRequerida: 7500
  │  └─ xpParaSiguiente: 15000
  │
  └─ fruto/
     ├─ orden: 6
     ├─ nombre: "Fruto"
     ├─ xpRequerida: 15000
     └─ xpParaSiguiente: 999999
```

---

### 5. `retos/` - Desafíos disponibles
**Documento por reto**

```
retos/
  └─ {retoId}/
     ├─ titulo: "Fogata Segura"
     ├─ descripcion: "Construye una fogata segura..."
     ├─ tipo: "fogata"
     ├─ nivelRecomendado: "Tallo"
     ├─ xpRecompensa: 80
     ├─ criteriosEvaluacion: "Debe demostrar seguridad..."
     ├─ imagenReferencia: "https://..."
     ├─ estado: "activo"
     ├─ creadoPor: "admin_1"
     ├─ createdAt: Timestamp
     └─ updatedAt: Timestamp
```

---

### 6. `cartillas/` - Documentos de formación
**Documento por cartilla**

```
cartillas/
  └─ {cartillaId}/
     ├─ nombre: "Fogata Segura"
     ├─ slug: "fogata-segura"
     ├─ descripcion: "Aprende a construir fogatas seguras"
     ├─ contenido: "<h2>Introducción...</h2><p>..."
     ├─ nivel: "Tallo"
     ├─ categoria: "Técnicas Campamentiles"
     ├─ icono: "🔥"
     ├─ colorTema: "#FF4500"
     ├─ imagenPortada: "https://..."
     ├─ archivoPdf: "https://..."
     ├─ orden: 3
     ├─ seccion: "Habilidades Técnicas"
     ├─ competidosTotal: 245
     ├─ creadoPor: "admin_1"
     ├─ createdAt: Timestamp
     └─ updatedAt: Timestamp
```

---

### 7. `cartillasProgreso/` - Progreso en cartillas
**Formato de ID: `{uid}_{cartillaId}`**

```
cartillasProgreso/
  └─ user_123_cartilla_001/
     ├─ uid: "user_123"
     ├─ cartillaId: "cartilla_001"
     ├─ completada: true
     ├─ porcentajeLeido: 100
     ├─ fechaInicio: Timestamp
     ├─ fechaCompletacion: Timestamp
     └─ tiempoDedicado: 1800
```

---

### 8. `municipios/` - Bosques locales
**Documento por municipio**

```
municipios/
  └─ {municipioId}/
     ├─ nombre: "Medellín"
     ├─ departamento: "Antioquia"
     ├─ bosqueNombre: "Bosque del Río Magdalena"
     ├─ bosqueDescripcion: "Grupo de campistas de Medellín"
     ├─ campistasTotal: 47
     ├─ lideresTotal: 3
     ├─ coordenadas: { latitud: 6.2442, longitud: -75.5812 }
     └─ createdAt: Timestamp
```

---

### 9. `actividadReciente/` - Timeline de actividad (OPCIONAL)
**Documento por actividad**

```
actividadReciente/
  └─ {actividadId}/
     ├─ uid: "user_123"
     ├─ usuarioNombre: "María Gómez"
     ├─ usuarioAvatar: "https://..."
     ├─ tipo: "cartilla_completada"
     ├─ descripcion: "Completó cartilla 'Fogata Segura'"
     ├─ metadatos: { cartillaId: "...", xpGanado: 50 }
     ├─ createdAt: Timestamp
     └─ mes: "2026-08"
```

---

## 🔐 FIRESTORE RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // PROFILES - Cada usuario ve todas, solo edita la suya
    match /profiles/{uid} {
      allow read: if true;
      allow create: if request.auth.uid == uid;
      allow update: if request.auth.uid == uid;
      allow delete: if false;
    }
    
    // POSTS - Todos leen, solo creador puede crear/borrar
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow update: if request.auth.uid == resource.data.validadorUid;
      allow delete: if request.auth.uid == resource.data.uid;
    }
    
    // INTERACTIONS - Todos leen, solo creador puede crear/borrar
    match /interactions/{interactionId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow delete: if request.auth.uid == resource.data.uid;
    }
    
    // LEVELS - Solo lectura
    match /levels/{levelId} {
      allow read: if true;
      allow write: if false;
    }
    
    // RETOS - Solo lectura
    match /retos/{retoId} {
      allow read: if true;
      allow write: if false;
    }
    
    // CARTILLAS - Solo lectura
    match /cartillas/{cartillaId} {
      allow read: if true;
      allow write: if false;
    }
    
    // CARTILLAS PROGRESO - Solo el usuario
    match /cartillasProgreso/{docId} {
      allow read: if request.auth.uid == resource.data.uid;
      allow create: if request.auth.uid == request.resource.data.uid;
      allow update: if request.auth.uid == resource.data.uid;
      allow delete: if false;
    }
    
    // MUNICIPIOS - Solo lectura
    match /municipios/{municipioId} {
      allow read: if true;
      allow write: if false;
    }
    
    // ACTIVIDAD - Solo lectura
    match /actividadReciente/{actividadId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🔢 ÍNDICES COMPUESTOS NECESARIOS

```
Colección: posts
├─ Fields: estado (Ascending), createdAt (Descending)
├─ Fields: retoTipo (Ascending), estado (Ascending), createdAt (Descending)

Colección: profiles
├─ Fields: activo (Ascending), xpTotal (Descending)
├─ Fields: activo (Ascending), municipio (Ascending), xpTotal (Descending)

Colección: interactions
├─ Fields: postId (Ascending), createdAt (Descending)
└─ Fields: uid (Ascending), createdAt (Descending)
```

---

## ✅ CHECKLIST DE CREACIÓN

Para crear estas colecciones manualmente en Firebase Console:

- [ ] Crear colección `profiles` (Firestore UI)
- [ ] Crear colección `posts`
- [ ] Crear colección `interactions`
- [ ] Crear colección `levels` con 6 documentos
- [ ] Crear colección `retos`
- [ ] Crear colección `cartillas`
- [ ] Crear colección `cartillasProgreso`
- [ ] Crear colección `municipios`
- [ ] Crear colección `actividadReciente` (opcional)
- [ ] Crear índices compuestos en Firebase Console
- [ ] Copiar/actualizar reglas de seguridad
- [ ] Verificar que permisos funcionan correctamente

---

## 📝 NOTAS

- Todos los `Timestamp` son de tipo `firebase.firestore.Timestamp`
- Los IDs de documentos pueden ser auto-generados excepto:
  - `levels/`: usar IDs específicos (semilla, raiz, tallo, hoja, flor, fruto)
  - `profiles/`: usar UID de autenticación
  - `cartillasProgreso/`: usar formato `{uid}_{cartillaId}`
- Las subcollections NO se utilizan en este diseño (todo es plano)
- Denormalización es intencional para optimizar lecturas

---

## 🚀 SIGUIENTE PASO

Ejecutar `SEED_LEVELS.md` para cargar datos iniciales de:
- 6 niveles
- 5 retos base
- 8 cartillas de ejemplo
- 3 municipios colombianos
