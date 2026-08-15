# 🚨 RESUMEN PROBLEMAS ARQUITECTÓNICOS - CAMPISTAS FIREBASE

## 3 PROBLEMAS CRÍTICOS QUE BLOQUEAN DEPLOY

### 1. ❌ NOMBRE DE COLECCIÓN INCORRECTO: "interactions" vs "interacciones"

**Archivo**: `src/services/interactionsService.ts`  
**Problema**: El código usa `'interactions'` pero firestore.rules define `'interacciones'`

```typescript
// ❌ INCORRECTO (código actual)
collection(db, 'interactions')

// ✅ CORRECTO (según firestore.rules)
collection(db, 'interacciones')
```

**Afecta**: Todo el sistema social (fogatas, nudos, interacciones de posts)  
**Error que recibirá**: `Missing or insufficient permissions` en producción

**Acción**: Cambiar `'interactions'` → `'interacciones'` en 6 líneas de interactionsService.ts

---

### 2. ❌ COLECCIÓN "posts" NO TIENE REGLAS DE SEGURIDAD

**Archivo**: `src/services/postsService.ts`  
**Problema**: El código accede a colección `'posts'` que NO está definida en firestore.rules

```typescript
// ❌ NO SEGURA (código actual)
collection(db, 'posts')

// Firestore rules NO contiene:
// match /posts/{document=**} { ... }
```

**Afecta**: 
- HomePage (feed social) - `getFeedSocial()`
- PublicarRetoPage - `createPost()`
- Toda la funcionalidad de posts

**Error**: `Missing or insufficient permissions`

**Acciones posibles**:
- Opción A: Agregar reglas de seguridad para `/posts` en firestore.rules
- Opción B: Cambiar arquitectura para usar `/publicacionesRetos` como colección de posts

---

### 3. ❌ DUPLICACIÓN DE PUBLICACIONES: "publicacionesRetos" vs "retos/publicaciones"

**Archivo**: `src/services/retosService.ts`  
**Problema**: El código usa AMBAS estructuras simultáneamente

```typescript
// ❌ USA AMBAS (confusión arquitectónica)

// Cuando NO hay retoId específico:
collection(db, 'publicacionesRetos')  // ← Top-level

// Cuando hay retoId específico:
collection(db, 'retos', retoId, 'publicaciones')  // ← Subcollection

// Pero firestore.rules SOLO define:
// match /retos/{retoId}/publicaciones/{pubId} { ... }
```

**Afecta**: 
- AdminPage - `getPublicacionesPendientes()` sin retoId
- Validación de retos

**Problemas**:
- `publicacionesRetos` no tiene reglas de seguridad
- Dos fuentes de verdad diferentes
- Mantenimiento imposible
- Sincronización entre colecciones rota

**Acción**: Unificar usando SOLO `/retos/{retoId}/publicaciones`

---

## SERVICIOS HUÉRFANOS (Deuda Técnica)

### No Importados en Ningún Feature

| Archivo | Colecciones | Estado |
|---------|------------|--------|
| `quizzesService.ts` | preguntas, respuestas, quizAttempts | 📦 Feature quiz NO implementada |
| `leaderboardRealService.ts` | profiles, leaderboard | ⚠️ Duplicado de profileService |
| `campistaService.ts` | profiles, levels | ⚠️ Duplicado de campistaProfileService |

**Acción**: Limpiar o consolidar antes de siguiente sprint

---

## COLECCIONES SIN USAR EN CÓDIGO

Definidas en firestore.rules pero no usadas en código:

- `users` - Solo creación en registro
- `levels` - Solo lectura en campistaService
- `departments` - Nunca se accede
- `municipalities` - Nunca se accede  
- `cartillas` + `progreso` - Contenido educativo no implementado
- `categoriesQuiz` - No existe en el código

**Riesgo**: Features futuras quedarán bloqueadas. Datos maestros no inicializados.

---

## MATRIZ DE SERVICIOS EN USO

```
✅ ACTIVOS Y EN USO
├── authService → profiles, users
├── retosService → retos, publicacionesRetos, validaciones, logsActividad
├── postsService → posts [⚠️ SIN REGLAS]
├── interactionsService → interactions [⚠️ NOMBRE INCORRECTO]
├── campistaProfileService → profiles
└── profileService → profiles, leaderboard

❌ NO USADOS
├── quizzesService
├── leaderboardRealService
├── campistaService

⚪ MOCK ONLY
├── leaderboardService
└── challengesService
```

---

## PLAN DE ACCIÓN (PRIORIDAD)

### 🔴 ANTES DE DEPLOY (Hoy)
1. Renombrar `interactions` → `interacciones`
2. Resolver arquitectura de `posts`
3. Unificar `publicacionesRetos` con subcollection

### 🟡 SEMANA 1
4. Limpiar servicios huérfanos
5. Completar barrel export

### 🟢 PRÓXIMO SPRINT
6. Inicializar datos maestros (departments, municipalities)
7. Documentación de arquitectura

---

**ESTADO**: 🔴 CRÍTICO - No debe hacer deploy sin resolver problemas 1, 2, 3
