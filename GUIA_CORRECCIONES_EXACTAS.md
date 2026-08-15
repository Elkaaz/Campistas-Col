# 🔧 GUÍA DE CORRECCIONES - LÍNEAS EXACTAS A CAMBIAR

## PROBLEMA 1: Renombrar "interactions" → "interacciones"

**Archivo**: `src/services/interactionsService.ts`

### Cambios necesarios (6 líneas):

```typescript
// ❌ LÍNEA 33
const q = query(
  collection(db, 'interactions'),  // ← CAMBIAR A 'interacciones'
  where('uid', '==', uid),
  ...
)

// ✅ CAMBIO:
// 'interactions' → 'interacciones'

// ❌ LÍNEA 42
await addDoc(collection(db, 'interactions'), {  // ← CAMBIAR A 'interacciones'
  
// ✅ CAMBIO:
// 'interactions' → 'interacciones'

// ❌ LÍNEA 75
const q = query(
  collection(db, 'interactions'),  // ← CAMBIAR A 'interacciones'
  ...
)

// ✅ CAMBIO:
// 'interactions' → 'interacciones'

// ❌ LÍNEA 104
const q = query(
  collection(db, 'interactions'),  // ← CAMBIAR A 'interacciones'
  ...
)

// ✅ CAMBIO:
// 'interactions' → 'interacciones'

// ❌ LÍNEA 125
const q = query(
  collection(db, 'interactions'),  // ← CAMBIAR A 'interacciones'
  ...
)

// ✅ CAMBIO:
// 'interactions' → 'interacciones'

// ❌ LÍNEA 150
const q = query(
  collection(db, 'interactions'),  // ← CAMBIAR A 'interacciones'
  ...
)

// ✅ CAMBIO:
// 'interactions' → 'interacciones'
```

**Comando para reemplazar todas a la vez**:
```bash
cd src/services
sed -i "s/collection(db, 'interactions')/collection(db, 'interacciones')/g" interactionsService.ts

# O en PowerShell:
(Get-Content interactionsService.ts) -replace "collection\(db, 'interactions'\)", "collection(db, 'interacciones')" | Set-Content interactionsService.ts
```

---

## PROBLEMA 2: Resolver arquitectura de "posts"

**Archivo**: `src/services/postsService.ts`

### Opción A: Agregar reglas a firestore.rules

Agregar antes de la última llave `}` en `firestore.rules`:

```firestore
    // Posts collection (social feed)
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.uid == request.auth.uid || isLider() || isAdmin());
      allow delete: if isAuthenticated() && resource.data.uid == request.auth.uid;
    }
```

**Ubicación exacta en firestore.rules**: Antes de línea final `}`

### Opción B: Migrar a publicacionesRetos dentro de retos

Si se elige migrar, cambiar en `postsService.ts`:

```typescript
// ❌ ACTUAL (Línea 26)
const q = query(
  collection(db, 'posts'),  // ← CAMBIAR A subcollection
  where('estado', '==', 'validado'),
  orderBy('createdAt', 'desc'),
  limit(limitNum)
)

// ✅ CAMBIO (Opción: si queda dentro de retos)
// Esto requeriría refactorizar toda la función para iterar sobre retos
// NO RECOMENDADO - Mejor agregar reglas (Opción A)
```

**Recomendación**: OPCIÓN A (agregar reglas) es más simple y mantiene arquitectura clara.

---

## PROBLEMA 3: Unificar publicacionesRetos con subcollection

**Archivo**: `src/services/retosService.ts`

### Cambios necesarios:

#### Eliminar referencias a "publicacionesRetos" top-level

```typescript
// ❌ LÍNEA 131 - ELIMINAR O CAMBIAR
const snap = await getDocs(
  query(collection(db, 'publicacionesRetos'), where('estado', '==', 'pendiente')),
)

// ✅ SOLUCIÓN: Refactorizar getPublicacionesPendientes()
// para que siempre requiera retoId, o iterar sobre todos los retos
```

### Opción A: Requerer retoId siempre

```typescript
// ✅ NUEVO (simplificado)
export async function getPublicacionesPendientes(retoId: string): Promise<PublicacionReto[]> {
  if (!db || !retoId) return []

  try {
    const snap = await getDocs(
      query(
        collection(db, 'retos', retoId, 'publicaciones'),
        where('estado', '==', 'pendiente'),
      ),
    )
    return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PublicacionReto))
  } catch (error) {
    console.error('Error fetching pending publications:', error)
    return []
  }
}
```

**Impacto**: AdminPage.tsx necesitaría cambio también (línea 4)

### Opción B: Iterar sobre todos los retos (más costoso)

```typescript
export async function getPublicacionesPendientes(
  retoId?: string,
): Promise<PublicacionReto[]> {
  if (!db) return []

  try {
    if (retoId) {
      // Caso específico: un reto
      const snap = await getDocs(
        query(
          collection(db, 'retos', retoId, 'publicaciones'),
          where('estado', '==', 'pendiente'),
        ),
      )
      return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PublicacionReto))
    } else {
      // Caso general: todos los retos
      const retosSnap = await getDocs(collection(db, 'retos'))
      const allPublicaciones: PublicacionReto[] = []
      
      for (const retoDoc of retosSnap.docs) {
        const snap = await getDocs(
          query(
            collection(db, 'retos', retoDoc.id, 'publicaciones'),
            where('estado', '==', 'pendiente'),
          ),
        )
        allPublicaciones.push(
          ...snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PublicacionReto))
        )
      }
      return allPublicaciones
    }
  } catch (error) {
    console.error('Error fetching pending publications:', error)
    return []
  }
}
```

**Recomendación**: OPCIÓN A (requerer retoId) - más simple y eficiente.

---

## PROBLEMA 4: Completar barrel export

**Archivo**: `src/services/index.ts`

### Cambio necesario:

```typescript
// ❌ ACTUAL (incompleto)
export { postsService } from './postsService'
export { interactionsService } from './interactionsService'
export { profileService } from './profileService'

// ✅ NUEVO (completo)
export { authService } from './authService'
export { postsService } from './postsService'
export { interactionsService } from './interactionsService'
export { profileService } from './profileService'
export { retosService } from './retosService'
export { campistaProfileService } from './campistaProfileService'
export { quizzesService } from './quizzesService'
export { leaderboardRealService } from './leaderboardRealService'
export { campistaService } from './campistaService'
export { leaderboardService } from './leaderboardService'
export { challengesService } from './challengesService'
```

---

## PROBLEMA 5: Limpiar servicios huérfanos

### Opción A: Eliminar archivos

```bash
# Eliminar servicios no usados
rm src/services/quizzesService.ts
rm src/services/leaderboardRealService.ts
rm src/services/campistaService.ts
```

### Opción B: Consolidar

#### Consolidar leaderboardRealService con profileService

```typescript
// En profileService.ts, agregar funciones de leaderboardRealService:
export async function getLeaderboardGlobal(pageSize: number = 50): Promise<LeaderboardEntry[]> {
  // Contenido de leaderboardRealService.getLeaderboardGlobal()
}

export async function getRankByUid(uid: string): Promise<LeaderboardEntry | null> {
  // Contenido de leaderboardRealService.getRankByUid()
}

// Eliminar leaderboardRealService.ts
```

#### Consolidar campistaService con campistaProfileService

```typescript
// En campistaProfileService.ts, agregar (si falta):
export async function getLevels() {
  // Contenido de campistaService.getLevels()
}

// Eliminar campistaService.ts
```

---

## RESUMEN DE CAMBIOS

| # | Archivo | Cambio | Complejidad | Tiempo |
|----|---------|--------|-----------|--------|
| 1 | `interactionsService.ts` | Renombrar 6 líneas | 🟢 TRIVIAL | 5 min |
| 2 | `firestore.rules` | Agregar regla POST | 🟢 TRIVIAL | 5 min |
| 3 | `retosService.ts` | Refactorizar función | 🟡 MEDIA | 15 min |
| 4 | `index.ts` | Completar exports | 🟢 TRIVIAL | 5 min |
| 5 | Servicios huérfanos | Consolidar o eliminar | 🟡 MEDIA | 20 min |

**Tiempo total**: ~50 minutos para resolver TODO

---

## TESTING DESPUÉS DE CAMBIOS

```typescript
// Test 1: Interactions funciona con 'interacciones'
const interactions = await interactionsService.addInteraction(
  'uid', 'nombre', 'avatar', 'postId', 'fogata'
)
// Debe guardar en /interacciones sin errores de permisos

// Test 2: Posts funciona con reglas
const post = await postsService.createPost({
  retoId: 'reto1',
  uid: 'uid',
  titulo: 'Test',
  // ...
})
// Debe guardar en /posts sin errores de permisos

// Test 3: Publicaciones usan subcollection
const pubs = await retosService.getPublicacionesPendientes('reto1')
// Debe leer de /retos/reto1/publicaciones sin errores
```

---

## VALIDACIÓN FIRESTORE RULES

Después de cambios, ejecutar en Firebase Console:

```
Test: Crear interaction
Path: interacciones/test1
Auth: UID conocido
Data: { uid: "test", postId: "post1", tipo: "fogata" }
Expected: ✅ Allow

Test: Crear post
Path: posts/test1
Auth: UID conocido
Data: { uid: "test", titulo: "Test", estado: "pendiente" }
Expected: ✅ Allow

Test: Crear publicación en reto
Path: retos/reto1/publicaciones/pub1
Auth: UID conocido
Data: { uid: "test", retoId: "reto1", estado: "pendiente" }
Expected: ✅ Allow
```

