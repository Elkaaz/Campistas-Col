# 🔍 ANÁLISIS ARQUITECTÓNICO - Campistas Firebase

**Fecha**: 2026-08-14  
**Alcance**: Servicios, colecciones Firestore, reglas de seguridad, dependencias

---

## 📊 RESUMEN EJECUTIVO

| Aspecto | Estado | Impacto |
|---------|--------|--------|
| Servicios con desajustes | 3 críticos | 🔴 BLOQUEA DEPLOY |
| Colecciones huérfanas | 2 | 🟡 INCONSISTENCIA |
| Servicios sin usar | 3 | 🟡 DEUDA TÉCNICA |
| Nombres de colecciones inconsistentes | 2 | 🔴 BREAKS FIRESTORE SECURITY |

---

## 1️⃣ SERVICIOS EXISTENTES (12 archivos)

### ✅ SERVICIOS EN USO ACTIVO

| Servicio | Ubicación | Usado en | Colecciones |
|----------|-----------|----------|------------|
| `authService.ts` | `src/services/` | LoginForm, RegisterForm | `profiles`, `users` |
| `retosService.ts` | `src/services/` | AdminPage, ChallengePage | `retos`, `publicacionesRetos`, `validaciones`, `logsActividad` |
| `postsService.ts` | `src/services/` | PublicarRetoPage, HomePage | `posts` |
| `interactionsService.ts` | `src/services/` | HomePage | `interactions` |
| `campistaProfileService.ts` | `src/services/` | ProfileForm | `profiles` |
| `profileService.ts` | `src/services/` | LeaderboardPage | `profiles`, `leaderboard` |

### ⚠️ SERVICIOS CON MOCK DATA O SIN USO

| Servicio | Estado | Ubicación | Usados en | Nota |
|----------|--------|-----------|----------|------|
| `leaderboardService.ts` | MOCK ONLY | DashboardPage | Mock data | No accede a Firestore |
| `challengesService.ts` | MOCK ONLY | DashboardPage | Mock data | No accede a Firestore |

### ❌ SERVICIOS HUÉRFANOS (No importados en features)

| Servicio | Colecciones | Razón probable |
|----------|------------|-----------------|
| `quizzesService.ts` | `preguntas`, `respuestas`, `quizAttempts` | Feature de quiz no implementada |
| `leaderboardRealService.ts` | `profiles`, `leaderboard` | Duplicado/Abandonado de profileService |
| `campistaService.ts` | `profiles`, `levels` | Duplicado de profileService/campistaProfileService |

### ℹ️ ARCHIVOS DE APOYO

| Archivo | Propósito |
|---------|-----------|
| `index.ts` | Barrel export (incompleto: solo exporta postsService, interactionsService, profileService) |

---

## 2️⃣ COLECCIONES FIRESTORE - ANÁLISIS COMPARATIVO

### 🔴 DESAJUSTES CRÍTICOS (BLOQUEA FUNCIONAMIENTO)

#### **PROBLEMA 1: Nombre de colección incorrecto - "interactions" vs "interacciones"**

```
┌─ CÓDIGO (interactionsService.ts)
│  collection(db, 'interactions')  ← ERROR: Nombre incorrecto
│  - addInteraction()
│  - removeInteraction()
│  - getUserInteractions()
│  - getPostInteractions()
│
└─ FIRESTORE RULES (firestore.rules)
   match /interacciones/{interaccionId}  ← Nombre correcto en reglas
```

**Impacto**: 🔴 CRÍTICO  
- Los reads/writes a `interactions` fallarán con error de permisos
- Las interacciones no se guardarán ni se recuperarán
- Toda la funcionalidad social se rompe (fogatas, nudos)

**Solución**: Renombrar `interactions` → `interacciones` en interactionsService.ts

---

#### **PROBLEMA 2: Colección "posts" no está definida en Firestore Rules**

```
┌─ CÓDIGO (postsService.ts)
│  collection(db, 'posts')  ← COLECCIÓN NO SEGURA
│  - getFeedSocial()
│  - getPostsByType()
│  - createPost()
│  - updatePostStatus()
│
└─ FIRESTORE RULES
   ✗ NO existe: match /posts/{postId}
```

**Impacto**: 🔴 CRÍTICO  
- No hay reglas de seguridad para `/posts`
- Acceso rechazado por Firestore
- Feed social completo fallará

**Solución**: 
- Opción A: Agregar reglas en firestore.rules
- Opción B: Usar `publicacionesRetos` como colección principal (realinearse con arquitectura de retos)

---

#### **PROBLEMA 3: Duplicación de publicaciones - "publicacionesRetos" vs "retos/publicaciones"**

```
┌─ CÓDIGO (retosService.ts) - USA AMBAS:
│  1. collection(db, 'publicacionesRetos')  ← Top-level collection
│     getPublicacionesPendientes() sin retoId
│  2. collection(db, 'retos', retoId, 'publicaciones')  ← Subcollection
│     getPublicacionesPendientes(retoId) con retoId
│
└─ FIRESTORE RULES
   ✓ Define solo: match /retos/{retoId}/publicaciones/{pubId}
   ✗ NO define: match /publicacionesRetos/{pubId}
```

**Impacto**: 🔴 CRÍTICO  
- `publicacionesRetos` top-level no tiene reglas de seguridad
- Estructura duplicada crea confusión y inconsistencia
- Dificulta mantenimiento y actualizaciones

**Solución**: Unificar usando SOLO subcollection `/retos/{retoId}/publicaciones`

---

### 🟡 DESAJUSTES MODERADOS (Colecciones sin usar)

#### **Colecciones definidas en Reglas pero NO usadas en Código**

| Colección | Subcollections | Estado | Notas |
|-----------|-----------------|--------|-------|
| `users` | - | Solo creación en registro | Debería expandirse con info adicional |
| `levels` | - | Solo lectura en campistaService | Referencia de configuración |
| `departments` | - | No usado | Datos maestros para filtros |
| `municipalities` | - | No usado | Datos maestros para formularios |
| `cartillas` | `progreso` | No usado | Contenido educativo no implementado |
| `categoriesQuiz` | - | No usado | Quiz feature pendiente |

**Impacto**: 🟡 MODERADO  
- Datos maestros no inicializados
- Features futuras quedarán bloqueadas
- Posibles errores de `where()` queries a colecciones vacías

---

## 3️⃣ RESUMEN DE COLECCIONES POR FUENTE

### 📋 Colecciones por Ubicación

```
┌─ FIRESTORE RULES (15 colecciones definidas)
│  ✓ users
│  ✓ profiles
│  ✓ levels
│  ✓ departments
│  ✓ municipalities
│  ✓ cartillas (+ progreso subcollection)
│  ✓ categoriesQuiz
│  ✓ preguntas
│  ✓ respuestas
│  ✓ quizAttempts
│  ✓ retos (+ publicaciones subcollection)
│  ✓ validaciones
│  ✓ interacciones
│  ✓ logsActividad
│  ✓ leaderboard
│
├─ EN CÓDIGO (11 colecciones accedidas)
│  ✓ profiles
│  ✓ users
│  ✓ retos
│  ✗ interactions (DEBERÍA SER: interacciones)
│  ✗ posts (NO ESTÁ EN REGLAS)
│  ✗ publicacionesRetos (NO ESTÁ EN REGLAS)
│  ✓ preguntas
│  ✓ respuestas
│  ✓ quizAttempts
│  ✓ validaciones
│  ✓ logsActividad
│  ✓ leaderboard
│  ? levels (solo lectura)
│
└─ SIN USAR EN CÓDIGO
   ✗ departments
   ✗ municipalities
   ✗ cartillas + progreso
   ✗ categoriesQuiz
```

---

## 4️⃣ MATRIZ DE DEPENDENCIAS (Servicios en Features)

```
src/features/
├── auth/
│   ├── LoginForm.tsx       → authService
│   └── RegisterForm.tsx    → authService
├── challenges/
│   ├── ChallengePage.tsx   → retosService
│   └── PublicarRetoPage.tsx → postsService
├── admin/
│   └── AdminPage.tsx       → retosService
├── leaderboard/
│   └── LeaderboardPage.tsx → profileService
├── profile/
│   └── ProfileForm.tsx     → campistaProfileService
├── social/
│   └── HomePage.tsx        → postsService, interactionsService
└── dashboard/
    └── DashboardPage.tsx   → leaderboardService (mock), challengesService (mock)
```

**Observación**: Solo 6 servicios reales están siendo usados. 3 están completamente abandonados.

---

## 5️⃣ ARCHIVOS HUÉRFANOS Y DEUDA TÉCNICA

### 🗑️ Archivos Sin Referencias Funcionales

1. **quizzesService.ts**
   - Funciones: `getQuestionsByQuizId()`, `getAnswersByQuestion()`, `submitQuizAttempt()`, `getAttempts()`
   - Colecciones: `preguntas`, `respuestas`, `quizAttempts`
   - Razón: Feature de quiz no implementada en features/
   - **Acción**: ⚠️ ¿Eliminar o planificar feature quiz para futuro?

2. **leaderboardRealService.ts**
   - Funciones: `getLeaderboardGlobal()`, `getRankByUid()`, `updateLeaderboard()`
   - Colecciones: `profiles`, `leaderboard`
   - Razón: Duplicado de funcionalidad en profileService.ts
   - **Acción**: 🔴 Consolidar con profileService o definir claramente su rol

3. **campistaService.ts**
   - Funciones: `getProfile()`, `createProfile()`, `updateProfile()`, `getLevels()`
   - Colecciones: `profiles`, `levels`
   - Razón: Funciones duplicadas con campistaProfileService.ts
   - **Acción**: 🔴 Eliminar o renombrar para evitar confusión

### 📦 Barrel Export Incompleto (index.ts)

```typescript
// ACTUAL (incompleto)
export { postsService } from './postsService'
export { interactionsService } from './interactionsService'
export { profileService } from './profileService'

// DEBERÍA SER (completo)
export { authService } from './authService'
export { postsService } from './postsService'
export { interactionsService } from './interactionsService'
export { profileService } from './profileService'
export { retosService } from './retosService'
export { campistaProfileService } from './campistaProfileService'
export { quizzesService } from './quizzesService'
// ... más exports
```

---

## 6️⃣ TABLA RESUMEN - INCONSISTENCIAS

| # | Tipo | Crítico | Archivo | Descripción | Solución |
|---|------|---------|---------|-------------|----------|
| 1 | Nombre colección | 🔴 | interactionsService.ts | Usa `interactions` en lugar de `interacciones` | Renombrar a `interacciones` |
| 2 | Colección no segura | 🔴 | postsService.ts | `posts` no definido en firestore.rules | Agregar regla o usar `publicacionesRetos` |
| 3 | Duplicación | 🔴 | retosService.ts | Usa `publicacionesRetos` y `retos/publicaciones` | Unificar en SOLO subcollection |
| 4 | Servicio huérfano | 🟡 | quizzesService.ts | No importado en features/ | Eliminar o implementar feature quiz |
| 5 | Servicio huérfano | 🟡 | leaderboardRealService.ts | Duplicado de profileService | Consolidar o eliminar |
| 6 | Servicio huérfano | 🟡 | campistaService.ts | Duplicado de campistaProfileService | Consolidar o eliminar |
| 7 | Datos maestros | 🟡 | Varias colecciones | Colecciones vacías: departments, municipalities, cartillas | Inicializar datos |
| 8 | Export incompleto | 🟡 | services/index.ts | Barrel export no incluye todos los servicios | Completar exports |

---

## 7️⃣ PLAN DE ACCIÓN (Prioridades)

### 🔴 CRÍTICO - Debe hacerse antes de deploy

1. **Renombrar `interactions` → `interacciones`**
   - Archivo: interactionsService.ts
   - Cambios: Reemplazar todas las instancias de `collection(db, 'interactions')`
   - Tiempo: 5 minutos

2. **Resolver conflicto de `posts`**
   - Opción A: Agregar reglas a firestore.rules para `/posts`
   - Opción B: Migrar postsService a usar `publicacionesRetos`
   - Decidir arquitectura y actuar

3. **Unificar colecciones de publicaciones**
   - Eliminar uso de `collection(db, 'publicacionesRetos')`
   - Usar SOLO `collection(db, 'retos', retoId, 'publicaciones')`
   - Migrar datos existentes

### 🟡 IMPORTANTE - Antes de siguiente sprint

4. **Limpiar servicios huérfanos**
   - Decidir destino de: quizzesService, leaderboardRealService, campistaService
   - Documentar si se planea implementar quiz feature
   - Consolidar duplicados

5. **Completar barrel export**
   - Actualizar `src/services/index.ts`
   - Incluir todos los servicios activos

6. **Inicializar datos maestros**
   - Crear seeder para departments, municipalities
   - Verificar levels están poblados

### 🟢 MEJORA TÉCNICA - Cuando sea posible

7. **Estandarizar nomenclatura de servicios**
   - Definir convención: `useXxxService` vs `xxxService` export
   - Crear documentación de arquitectura de servicios

8. **Documentar relaciones**
   - Crear diagrama de colecciones Firestore
   - Documentar subcollections y relaciones

---

## 📝 NOTAS TÉCNICAS

### Estructura Subcollections
```
retos/
  ├── {retoId}/
  │   └── publicaciones/
  │       └── {pubId} ← USAR AQUÍ
  └── [EVITAR: publicacionesRetos top-level]

cartillas/
  ├── {cartillaId}/
  │   └── progreso/
  │       └── {uid}
```

### Queries Afectados

```typescript
// ❌ ACTUAL (rompe)
collection(db, 'interactions')
collection(db, 'posts')
collection(db, 'publicacionesRetos')

// ✅ CORRECTO
collection(db, 'interacciones')
collection(db, 'retos', retoId, 'publicaciones')
// posts: Decidir si agregar reglas o migrar
```

---

## 📊 ESTADÍSTICAS

- **Total Servicios**: 12
- **En Uso Activo**: 6 (50%)
- **Mock Data Only**: 2 (17%)
- **Huérfanos**: 3 (25%)
- **Apoyo/Barrels**: 1 (8%)

- **Colecciones Definidas**: 15
- **Colecciones en Código**: 11
- **Desajustes Críticos**: 3
- **Sin Usar en Código**: 4

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Renombrar `interactions` a `interacciones` en interactionsService.ts
- [ ] Decidir arquitectura de `posts` (rules vs estructura)
- [ ] Unificar publicaciones en subcollection de retos
- [ ] Limpiar/consolidar quizzesService, leaderboardRealService, campistaService
- [ ] Completar barrel export en services/index.ts
- [ ] Ejecutar tests de integración con Firestore
- [ ] Validar todas las queries de collection() funcionan
- [ ] Documentar arquitectura de servicios

---

**Generado**: 2026-08-14  
**Análisis por**: GitHub Copilot  
**Estado**: 🔴 REQUIERE ACCIONES CRÍTICAS ANTES DE DEPLOY
