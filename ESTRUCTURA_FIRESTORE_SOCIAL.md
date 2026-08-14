# 📊 ESTRUCTURA DE FIRESTORE PARA RED SOCIAL
## Colecciones y Documentos Necesarios

---

## 🔍 COLECCIONES ACTUALES vs PROPUESTAS

### ACTUALES (Existentes - ✅)
```
profiles/         - Datos de campistas
├── uid_campista/
│   ├── displayName
│   ├── email
│   ├── xpTotal
│   ├── nivelActual
│   ├── tipoSangre
│   ├── eps
│   └── perfilCompleto

users/           - Info de usuarios

retos/           - Desafíos
├── reto_id/
│   ├── titulo
│   ├── xpRecompensa
│   └── publicaciones/

validaciones/     - Historial validaciones

leaderboard/      - Rankings

quizzes/          - Cartillas

logsActividad/    - Registro acciones
```

### PROPUESTAS (Nuevas - 🆕)
```
posts/            - Publicaciones de retos (NUEVA)
├── post_id/
│   ├── uid (usuario que publica)
│   ├── retoId
│   ├── titulo (del reto)
│   ├── descripcion
│   ├── imagen (URL Cloudinary)
│   ├── tipo (nudo, refugio, fogata, huerta, primeros_auxilios)
│   ├── estado (pendiente_validacion, validado, rechazado)
│   ├── xpAsignado
│   ├── validadorUid (null si pendiente)
│   ├── createdAt
│   ├── updatedAt
│   └── interactions/ (subcollection)

interactions/     - Reacciones a posts (NUEVA)
├── interaction_id/
│   ├── uid (usuario que reacciona)
│   ├── postId
│   ├── tipo (fogata, nudo)
│   └── createdAt

cartillas/        - Documentos de formación (NUEVA)
├── cartilla_id/
│   ├── nombre
│   ├── slug
│   ├── descripcion
│   ├── nivel (Semilla, Raíz, Tallo, Hoja, Flor, Fruto)
│   ├── contenido (HTML o markdown)
│   ├── icono (emoji)
│   ├── colorTema
│   ├── archivoPdf (URL)
│   └── fechaCreacion

cartillasProgreso/  - Seguimiento de usuario (NUEVA)
├── uid_cartilla_id/
│   ├── uid
│   ├── cartillaId
│   ├── completada
│   ├── fechaInicio
│   ├── fechaCompletacion
│   └── tiempoDedicado

niveles/          - Sistema de progresión (NUEVA)
├── semilla/
│   ├── orden: 1
│   ├── nombre: "Semilla"
│   ├── descripcion
│   ├── color: "#8B7355"
│   ├── icono: "🌱"
│   └── xpRequerida: 0
├── raiz/
│   └─ ...
├── tallo/
│   ├── orden: 3
│   ├── nombre: "Tallo"
│   ├── color: "#228B22"
│   ├── xpRequerida: 500
│   └─ ...
└── fruto/
   └─ ...

municipios/       - Bosques (NUEVA)
├── municipio_id/
│   ├── nombre: "Medellín"
│   ├── departamento: "Antioquia"
│   ├── bosqueNombre: "Bosque del Rió Magdalena"
│   └── coordenadas (opcional)

actividadReciente/  - Timeline (NUEVA)
├── activity_id/
│   ├── uid
│   ├── tipo (cartilla_completada, reto_publicado, nivel_subido, validacion_aprobada)
│   ├── descripcion
│   ├── tiempoAtrás
│   ├── createdAt
│   └── metadatos (objeto relacionado)

comentarios/      - Comentarios en posts (NUEVA - opcional)
├── comment_id/
│   ├── postId
│   ├── uid
│   ├── texto
│   ├── createdAt
│   └── likes
```

---

## 📐 ESTRUCTURA DETALLADA DE NUEVAS COLECCIONES

### 1. COLECCIÓN: `posts`
**Propósito**: Publicaciones de retos completados (El Fogón)

```javascript
{
  postId: "post_abc123",
  // AUTOR
  uid: "user_123",
  autoresNombre: "María Gómez",
  autoresAvatar: "https://cloudinary.com/...",
  autoresNivel: "Tallo",
  autoresNivelColor: "#228B22",
  
  // RETO
  retoId: "reto_456",
  retoTitulo: "Fogata Segura",
  retoTipo: "fogata",           // nudo, refugio, fogata, huerta, primeros_auxilios
  
  // CONTENIDO
  titulo: "Mi primera fogata segura 🔥",
  descripcion: "Completé el reto construyendo una fogata segura en campamento",
  imagenes: [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  
  // VALIDACIÓN
  estado: "validado",           // pendiente_validacion, validado, rechazado
  validadorUid: "user_lider_789",
  validadorNombre: "Juan Líder",
  fechaValidacion: timestamp,
  comentarioValidacion: "Excelente técnica de construcción",
  
  // RECOMPENSA
  xpAsignado: 80,
  
  // ESTADÍSTICAS
  contadorFogatas: 12,
  contadorNudos: 3,
  contadorComentarios: 2,
  
  // TIMESTAMPS
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // UBICACIÓN (denormalizado para queries)
  municipio: "Medellín",
  departamento: "Antioquia",
  
  // TAGS
  tags: ["fogata", "seguridad", "campamento"]
}
```

**Firestore Rules:**
```
match /posts/{document=**} {
  allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
  allow read: if true;
  allow update: if request.auth.uid == resource.data.validadorUid;
  allow delete: if request.auth.uid == resource.data.uid;
}
```

**Índices:**
```
posts: createdAt (descending)
posts: estado = validado, createdAt (descending)
posts: retoTipo, createdAt (descending)
posts: uid, createdAt (descending)
```

---

### 2. COLECCIÓN: `interactions`
**Propósito**: Reacciones a publicaciones (Fogatas 🔥 / Nudos 🪢)

```javascript
{
  interactionId: "inter_xyz789",
  
  // USUARIO QUE REACCIONA
  uid: "user_456",
  usuarioNombre: "Juan Pérez",
  
  // POST OBJETIVO
  postId: "post_abc123",
  
  // TIPO DE REACCIÓN
  tipo: "fogata",               // fogata, nudo
  
  // TIMESTAMPS
  createdAt: timestamp,
  
  // PARA QUERIES
  mes: "2026-08"                // Para análisis mensual
}
```

**Firestore Rules:**
```
match /interactions/{document=**} {
  allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
  allow read: if true;
  allow delete: if request.auth.uid == resource.data.uid;
}
```

**Índices:**
```
interactions: postId, createdAt (descending)
interactions: uid, createdAt (descending)
```

---

### 3. COLECCIÓN: `cartillas`
**Propósito**: Documentos técnicos de formación

```javascript
{
  cartillaId: "cartilla_001",
  
  // METADATOS
  nombre: "Fogata Segura",
  slug: "fogata-segura",        // Para URLs
  descripcion: "Aprende a construir una fogata segura",
  
  // CONTENIDO
  contenido: "<h2>Fog...</h2>", // HTML o markdown compilado
  archivoPdf: "https://cdn.com/fogata-segura.pdf",
  
  // CLASIFICACIÓN
  nivel: "Tallo",               // Nivel requerido para acceder
  categoria: "Técnicas Campamentiles",
  
  // VISUAL
  icono: "🔥",
  colorTema: "#FF4500",
  imagenPortada: "https://cloudinary.com/cartilla-cover.jpg",
  
  // ORGANIZACIÓN
  orden: 3,                     // Orden de presentación
  seccion: "Habilidades Técnicas",
  
  // ESTADÍSTICAS
  competidosTotal: 245,
  
  // TIMESTAMPS
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // AUTOR (denormalizado)
  creadoPor: "admin_123"
}
```

---

### 4. COLECCIÓN: `cartillasProgreso`
**Propósito**: Seguimiento de progreso de usuario en cartillas

```javascript
{
  // Formato de ID: {uid}_{cartillaId}
  // Ej: "user_123_cartilla_001"
  
  uid: "user_123",
  cartillaId: "cartilla_001",
  
  // PROGRESO
  completada: true,
  porcentajeLeido: 100,
  
  // TEMPORAL
  fechaInicio: timestamp,
  fechaCompletacion: timestamp,
  tiempoDedicado: 1800,         // segundos
  
  // DENORMALIZADO
  cartillaNombre: "Fogata Segura",
  usuarioNombre: "María Gómez"
}
```

**Composite Key:**
```
- El ID es: "{uid}_{cartillaId}"
- O usar campos uid + cartillaId con índice
```

---

### 5. COLECCIÓN: `niveles`
**Propósito**: Sistema de progresión

```javascript
// Documento para cada nivel
{
  // DOCUMENTO: "semilla", "raiz", "tallo", "hoja", "flor", "fruto"
  
  orden: 1,
  nombre: "Semilla",
  descripcion: "Aspirante nuevo, recién iniciando su camino campista",
  
  // VISUAL
  color: "#8B7355",
  colorSecundario: "#D2B48C",
  icono: "🌱",
  
  // PROGRESIÓN
  xpRequerida: 0,               // XP total para alcanzar este nivel
  xpParaSiguiente: 500,         // XP que necesita para el siguiente
  
  // BENEFICIOS
  cartillasDesbloqueadas: ["cartilla_001", "cartilla_002"],
  habilidadesBloqueadas: ["construccion_avanzada"],
  
  // TIMESTAMPS
  createdAt: timestamp
}
```

**Estructura Final Esperada:**
```
niveles/
├── semilla/      → orden: 1, xpRequerida: 0
├── raiz/         → orden: 2, xpRequerida: 500
├── tallo/        → orden: 3, xpRequerida: 1500
├── hoja/         → orden: 4, xpRequerida: 3500
├── flor/         → orden: 5, xpRequerida: 7500
└── fruto/        → orden: 6, xpRequerida: 15000
```

---

### 6. COLECCIÓN: `municipios`
**Propósito**: Bosques locales (agrupación territorial)

```javascript
{
  municipioId: "municipio_antioquia_001",
  
  // UBICACIÓN
  nombre: "Medellín",
  departamento: "Antioquia",
  
  // RED SOCIAL LOCAL
  bosqueNombre: "Bosque del Río Magdalena",
  bosqueDescripcion: "Grupo de campistas de Medellín",
  
  // ESTADÍSTICAS
  campistasTotal: 47,
  lideresTotal: 3,
  
  // OPCIONAL
  coordenadas: {
    latitud: 6.2442,
    longitud: -75.5812
  },
  
  // TIMESTAMPS
  createdAt: timestamp
}
```

---

### 7. COLECCIÓN: `actividadReciente`
**Propósito**: Timeline de actividad para el dashboard

```javascript
{
  actividadId: "act_abc123",
  
  // USUARIO
  uid: "user_123",
  usuarioNombre: "María Gómez",
  usuarioAvatar: "https://cloudinary.com/...",
  
  // TIPO DE ACTIVIDAD
  tipo: "cartilla_completada",
  // Opciones:
  // - cartilla_completada
  // - reto_publicado
  // - reto_validado
  // - nivel_subido
  // - quiz_completado
  // - interaccion_fogata
  // - interaccion_nudo
  
  // DESCRIPCIÓN
  descripcion: "Completó cartilla 'Fogata Segura'",
  
  // METADATOS (para acciones rápidas)
  metadatos: {
    cartillaId: "cartilla_001",
    cartillaNombre: "Fogata Segura",
    xpGanado: 50
  },
  
  // TIMESTAMPS
  createdAt: timestamp,
  
  // PARA QUERIES
  diasAtras: 2,                 // Recalculado periódicamente o en frontend
  mes: "2026-08"
}
```

---

### 8. COLECCIÓN EXISTENTE MEJORADA: `profiles`
**Cambios Propuestos:**

```javascript
{
  uid: "user_123",
  
  // INFORMACIÓN BÁSICA (Existente)
  displayName: "María Gómez",
  email: "maria@email.com",
  avatar: "https://cloudinary.com/avatar.jpg",
  
  // UBICACIÓN TERRITORIAL
  departamento: "Antioquia",
  municipio: "Medellín",
  nombreBosque: "Bosque del Río Magdalena",
  
  // GAMIFICACIÓN
  xpTotal: 1320,
  nivelActual: "Tallo",
  nivelOrden: 3,
  
  // DATOS MÉDICOS (Existentes)
  tipoSangre: "O+",
  eps: "SURA",
  alergias: "Penicilina",
  telefonoEmergencia: "+573001234567",
  
  // IDENTIFICACIÓN
  tipoDocumento: "CC",
  documento: "1234567890",
  fechaNacimiento: timestamp,
  
  // JERARQUÍA (NUEVO)
  rol: "campista",             // campista, lider_bosque, comite_departamental
  esLider: false,
  esComiteDeptal: false,
  
  // SOCIAL (NUEVO)
  biografia: "Campista apasionada por la naturaleza",
  habilidadEspecial: "nudos",  // nudos, fogatas, expresión_cultural, etc.
  
  // ESTADÍSTICAS (NUEVO)
  cartillasCompletadas: 4,
  cartillasTotal: 8,
  quizzesCompletados: 3,
  quizzesTotal: 6,
  retosPublicados: 6,
  retosValidados: 5,
  
  // FECHAS
  fechaRegistro: timestamp,
  ultimaActividad: timestamp,
  
  // ESTADO
  perfilCompleto: true,
  activo: true,
  
  // SEGUIDORES (OPCIONAL - para expansión futura)
  seguidores: 12,
  siguiendo: 8
}
```

---

## 🔄 RELACIONES Y QUERIES IMPORTANTES

### Query 1: Obtener El Fogón (Feed social)
```
Colección: posts
Filtros:
  - estado == "validado"
  - createdAt (ordenado descendente)
Orden: Por fecha (más reciente primero)
Paginación: 10 resultados
```

**Firestore Query (pseudo-código):**
```javascript
const postsQuery = query(
  collection(db, 'posts'),
  where('estado', '==', 'validado'),
  orderBy('createdAt', 'desc'),
  limit(10)
);
```

---

### Query 2: Publicaciones pendientes de validación (para líderes)
```
Colección: posts
Filtros:
  - estado == "pendiente_validacion"
Orden: Por fecha (más antiguos primero - urgente)
```

---

### Query 3: Leaderboard global
```
Colección: profiles
Ordenar por: xpTotal (desc)
Límite: 100
Mostrar campos: displayName, avatar, nivelActual, xpTotal, municipio
```

---

### Query 4: Mi Bosque (campistas locales)
```
Colección: profiles
Filtros:
  - departamento == "Antioquia"
  - municipio == "Medellín"
Ordenar por: xpTotal (desc)
```

---

### Query 5: Cartillas desbloqueadas
```
Colección: cartillas
Filtros:
  - nivel <= usuarioNivelOrden
Ordenar por: orden (asc)
Mostrar también: ¿Completada por usuario? (join con cartillasProgreso)
```

---

### Query 6: Actividad reciente del dashboard
```
Colección: actividadReciente
Filtros:
  - OPCIONAL: uid == currentUserId (si es actividad personal)
Ordenar por: createdAt (desc)
Límite: 5
```

---

## 📊 DENORMALIZACIÓN (Optimización)

**¿Qué campos denormalizamos?**
```
✅ EN POSTS:
  - autoresNombre (en lugar de buscar en profiles)
  - autoresAvatar
  - autoresNivel
  - municipio
  - departamento

✅ EN INTERACTIONS:
  - usuarioNombre
  
✅ EN ACTIVIDADRECIENTE:
  - usuarioNombre
  - usuarioAvatar
  - (metadatos del objeto relacionado)

✅ EN PROFILES:
  - nivelOrden (en lugar de buscar en niveles)
  - estadísticas calculadas (cartillasCompletadas, etc.)
```

**¿Por qué?**
- Firestore **no tiene JOINs**
- Denormalizar = menos lecturas = menos costo
- Mantener datos en sync es tarea del backend/functions

---

## 🔐 REGLAS DE SEGURIDAD (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // POSTS - Cualquiera puede leer, solo el autor puede crear/editar/borrar
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow update: if request.auth.uid == resource.data.validadorUid; // Solo validador
      allow delete: if request.auth.uid == resource.data.uid;
    }
    
    // INTERACTIONS - Cualquiera puede leer, solo el autor puede crear/borrar
    match /interactions/{interactionId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow delete: if request.auth.uid == resource.data.uid;
    }
    
    // CARTILLAS - Solo lectura
    match /cartillas/{cartillaId} {
      allow read: if true;
      allow write: if request.auth.uid in ['admin_123']; // Admin
    }
    
    // CARTILLAS PROGRESO - Solo el usuario puede leer/escribir la suya
    match /cartillasProgreso/{docId} {
      allow read: if request.auth.uid == resource.data.uid;
      allow create: if request.auth.uid == request.resource.data.uid;
      allow update: if request.auth.uid == resource.data.uid;
    }
    
    // NIVELES - Solo lectura
    match /niveles/{nivelId} {
      allow read: if true;
      allow write: if false;
    }
    
    // MUNICIPIOS - Solo lectura
    match /municipios/{municipioId} {
      allow read: if true;
      allow write: if false;
    }
    
    // ACTIVIDAD RECIENTE - Solo lectura
    match /actividadReciente/{actividadId} {
      allow read: if true;
      allow write: if false; // Solo Functions escriben
    }
    
    // PROFILES - Cada usuario puede leer todas, pero solo editar la suya
    match /profiles/{uid} {
      allow read: if true;
      allow create: if request.auth.uid == uid;
      allow update: if request.auth.uid == uid;
      allow delete: if false;
    }
  }
}
```

---

## 🔄 MIGRACIONES Y SEEDERS

### Seeder de Niveles (`seed-levels.js`)
```javascript
const levels = [
  {
    id: 'semilla',
    orden: 1,
    nombre: 'Semilla',
    color: '#8B7355',
    icono: '🌱',
    xpRequerida: 0,
    xpParaSiguiente: 500
  },
  // ... resto de niveles
];

// Escribir a Firestore
```

### Seeder de Cartillas (`seed-cartillas.js`)
```javascript
const cartillas = [
  {
    nombre: 'Fogata Segura',
    slug: 'fogata-segura',
    nivel: 'Tallo',
    icono: '🔥',
    contenido: '...',
  },
  // ... resto de cartillas
];
```

---

## ✅ CHECKLIST DE CREACIÓN DE COLECCIONES

- [ ] Crear colección `posts`
- [ ] Crear colección `interactions`
- [ ] Crear colección `cartillas` (popular desde Django)
- [ ] Crear colección `cartillasProgreso`
- [ ] Crear colección `niveles` (6 documentos)
- [ ] Crear colección `municipios` (32 documentos)
- [ ] Crear colección `actividadReciente`
- [ ] Mejorar colección `profiles` con nuevos campos
- [ ] Crear índices compuestos
- [ ] Actualizar reglas de seguridad
- [ ] Escribir seeders

---

**Próximo Paso**: ¿Comenzamos a implementar estas colecciones en Firestore?
