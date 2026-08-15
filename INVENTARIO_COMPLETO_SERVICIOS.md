# 📋 INVENTARIO COMPLETO DE SERVICIOS Y COLECCIONES

## TABLA 1: SERVICIOS Y SU ESTADO

| # | Servicio | Archivo | Estado | Features que lo usan | Colecciones | Notas |
|----|----------|---------|--------|----------------------|------------|-------|
| 1 | `authService` | `authService.ts` | ✅ ACTIVO | LoginForm, RegisterForm | `profiles`, `users` | Creación de usuarios |
| 2 | `retosService` | `retosService.ts` | ✅ ACTIVO | AdminPage, ChallengePage | `retos`, `publicacionesRetos`, `validaciones`, `logsActividad` | ⚠️ Usa 2 estructuras de publicaciones |
| 3 | `postsService` | `postsService.ts` | ✅ ACTIVO | PublicarRetoPage, HomePage | `posts` | 🔴 Sin reglas de seguridad |
| 4 | `interactionsService` | `interactionsService.ts` | ✅ ACTIVO | HomePage | `interactions` | 🔴 Debería ser `interacciones` |
| 5 | `campistaProfileService` | `campistaProfileService.ts` | ✅ ACTIVO | ProfileForm | `profiles` | Actualización de perfiles |
| 6 | `profileService` | `profileService.ts` | ✅ ACTIVO | LeaderboardPage | `profiles`, `leaderboard` | Lectura de leaderboard |
| 7 | `quizzesService` | `quizzesService.ts` | ❌ HUÉRFANO | Ninguno | `preguntas`, `respuestas`, `quizAttempts` | Feature quiz no implementada |
| 8 | `leaderboardRealService` | `leaderboardRealService.ts` | ❌ HUÉRFANO | Ninguno | `profiles`, `leaderboard` | Duplicado de profileService |
| 9 | `campistaService` | `campistaService.ts` | ❌ HUÉRFANO | Ninguno | `profiles`, `levels` | Duplicado de campistaProfileService |
| 10 | `leaderboardService` | `leaderboardService.ts` | ⚪ MOCK | DashboardPage | Ninguna | Solo mock data |
| 11 | `challengesService` | `challengesService.ts` | ⚪ MOCK | DashboardPage | Ninguna | Solo mock data |
| 12 | `index.ts` | `index.ts` | 📦 BARRELS | - | - | Export incompleto |

---

## TABLA 2: COLECCIONES - CÓDIGO VS FIRESTORE RULES

| Colección | En Código | En Rules | Usado | Subcollection | Estado | Acción |
|-----------|-----------|----------|-------|---------------|--------|--------|
| `profiles` | ✅ | ✅ | ✅ | - | ✅ OK | - |
| `users` | ✅ (reg) | ✅ | ✅ | - | ⚠️ Incompleto | Expandir uso |
| `retos` | ✅ | ✅ | ✅ | `publicaciones` | ✅ OK | - |
| `publicaciones` | ✅ | ✅ | ✅ | sub de retos | ✅ OK | - |
| `publicacionesRetos` | ✅ | ❌ | ✅ | - | 🔴 CONFLICTO | Eliminar/Unificar |
| `interactions` | ✅ | ❌ | ✅ | - | 🔴 NOMBRE | Renombrar a `interacciones` |
| `interacciones` | ❌ | ✅ | ❌ | - | 🔴 DESAJUSTE | Usar en código |
| `posts` | ✅ | ❌ | ✅ | - | 🔴 SIN REGLAS | Agregar rules o migrar |
| `preguntas` | ✅ | ✅ | ❌ | - | ⚠️ No usado | Implementar quiz |
| `respuestas` | ✅ | ✅ | ❌ | - | ⚠️ No usado | Implementar quiz |
| `quizAttempts` | ✅ | ✅ | ❌ | - | ⚠️ No usado | Implementar quiz |
| `validaciones` | ✅ | ✅ | ✅ | - | ✅ OK | - |
| `logsActividad` | ✅ | ✅ | ✅ | - | ✅ OK | - |
| `leaderboard` | ✅ | ✅ | ✅ | - | ✅ OK | - |
| `levels` | ⚠️ (ref) | ✅ | ⚠️ | - | ⚠️ Limitado | Expandir uso |
| `departments` | ❌ | ✅ | ❌ | - | 🔴 VACIO | Inicializar datos |
| `municipalities` | ❌ | ✅ | ❌ | - | 🔴 VACIO | Inicializar datos |
| `cartillas` | ❌ | ✅ | ❌ | `progreso` | 🔴 VACIO | Implementar feature |
| `categoriesQuiz` | ❌ | ✅ | ❌ | - | 🔴 VACIO | Implementar feature |

---

## TABLA 3: FUNCIONES POR SERVICIO

### authService.ts
```typescript
✅ registerUser(email, password, profile)
✅ loginUser(email, password)
✅ logoutUser()
- Accede: profiles, users
```

### retosService.ts
```typescript
✅ getRetos()
✅ publicarSolucionReto(retoId, uid, solucion)
✅ getPublicacionesPendientes(retoId?)
✅ validarSolucionReto(publicacionId, estado)
- Accede: retos, publicacionesRetos, retos/{retoId}/publicaciones, validaciones, logsActividad
- 🔴 PROBLEMA: Accede a 2 colecciones de publicaciones
```

### postsService.ts
```typescript
✅ getFeedSocial(limit)
✅ getPostsByType(type, limit)
✅ createPost(postData)
✅ updatePostStatus(postId, estado)
- Accede: posts
- 🔴 PROBLEMA: Colección sin reglas de seguridad
```

### interactionsService.ts
```typescript
✅ addInteraction(uid, nombre, avatar, postId, tipo)
✅ removeInteraction(uid, postId, tipo)
✅ getUserInteractions(uid)
✅ getPostInteractions(postId)
- Accede: interactions
- 🔴 PROBLEMA: Debería ser "interacciones"
```

### campistaProfileService.ts
```typescript
✅ getCampistaProfile(uid)
✅ updateCampistaProfile(uid, updates)
✅ completeCampistaProfile(uid, profileData)
✅ getCampistasPerDepartamento(departamento)
- Accede: profiles
```

### profileService.ts
```typescript
✅ getLeaderboard(limit)
- Accede: profiles, leaderboard
```

### quizzesService.ts (HUÉRFANO)
```typescript
❌ getQuestionsByQuizId(quizId)
❌ getAnswersByQuestion(preguntaId)
❌ submitQuizAttempt(attempt)
❌ getAttempts(uid)
- Accede: preguntas, respuestas, quizAttempts
- No usado en features/
```

### leaderboardRealService.ts (HUÉRFANO)
```typescript
❌ getLeaderboardGlobal(pageSize)
❌ getRankByUid(uid)
❌ updateLeaderboard(updates)
- Accede: profiles, leaderboard
- Duplicado de profileService
```

### campistaService.ts (HUÉRFANO)
```typescript
❌ getProfile(uid)
❌ createProfile(profile)
❌ updateProfile(uid, updates)
❌ getLevels()
- Accede: profiles, levels
- Duplicado de campistaProfileService
```

### leaderboardService.ts (MOCK)
```typescript
⚪ mockLeaderboard[]  // Solo datos mock
- No accede a Firestore
```

### challengesService.ts (MOCK)
```typescript
⚪ mockChallenges[]  // Solo datos mock
- No accede a Firestore
```

---

## TABLA 4: LINAJE DE IMPORTS

### Features → Services

```
src/features/
├── auth/
│   ├── LoginForm.tsx
│   │   └─→ authService.loginUser()
│   └── RegisterForm.tsx
│       └─→ authService.registerUser()
│
├── challenges/
│   ├── ChallengePage.tsx
│   │   └─→ retosService.getRetos()
│   │   └─→ retosService.publicarSolucionReto()
│   └── PublicarRetoPage.tsx
│       └─→ postsService.createPost()
│
├── admin/
│   └── AdminPage.tsx
│       └─→ retosService.getPublicacionesPendientes()
│       └─→ retosService.validarSolucionReto()
│
├── leaderboard/
│   └── LeaderboardPage.tsx
│       └─→ profileService.getLeaderboard()
│
├── profile/
│   └── ProfileForm.tsx
│       └─→ campistaProfileService.completeCampistaProfile()
│
├── social/
│   └── HomePage.tsx
│       └─→ postsService.getFeedSocial()
│       └─→ postsService.getPostsByType()
│       └─→ interactionsService.addInteraction()
│
└── dashboard/
    └── DashboardPage.tsx
        └─→ leaderboardService.mockLeaderboard
        └─→ challengesService.mockChallenges
```

---

## TABLA 5: PROBLEMAS POR SERVICIO

| Servicio | Problema | Tipo | Urgencia | Solución |
|----------|----------|------|----------|----------|
| `interactionsService` | Usa `interactions` en lugar de `interacciones` | Nombre | 🔴 CRÍTICA | Renombrar colección |
| `postsService` | Colección `posts` sin reglas de seguridad | Falta Regla | 🔴 CRÍTICA | Agregar rules o migrar |
| `retosService` | Usa `publicacionesRetos` Y subcollection | Duplicación | 🔴 CRÍTICA | Unificar en subcollection |
| `retosService` | getPublicacionesPendientes() sin retoId accede a top-level | Arquitectura | 🟡 MODERADA | Refactorizar lógica |
| `quizzesService` | No importado en features/ | Huérfano | 🟡 MODERADA | Eliminar o implementar |
| `leaderboardRealService` | Funcionalidad duplicada | Deuda | 🟡 MODERADA | Consolidar |
| `campistaService` | Funcionalidad duplicada | Deuda | 🟡 MODERADA | Consolidar |
| `index.ts` | Barrel export incompleto | Incompleto | 🟢 LEVE | Completar exports |

---

## TABLA 6: COLECCIONES VACÍAS

| Colección | Definida | Usada | Razón | Impacto | Acción |
|-----------|----------|-------|-------|--------|--------|
| `levels` | ✅ firestore.rules | ⚠️ Solo lectura | Referencia de configuración | ⚠️ Sin datos | Inicializar en seed |
| `departments` | ✅ firestore.rules | ❌ | Datos maestros | 🔴 Queries fallarán | Inicializar en seed |
| `municipalities` | ✅ firestore.rules | ❌ | Datos maestros | 🔴 Queries fallarán | Inicializar en seed |
| `cartillas` | ✅ firestore.rules | ❌ | Feature no implementada | 🔴 Feature bloqueada | Implementar o eliminar |
| `categoriesQuiz` | ✅ firestore.rules | ❌ | Feature quiz no implementada | 🔴 Feature bloqueada | Implementar o eliminar |

---

## ESTADÍSTICAS FINALES

### Servicios
- Total: 12 archivos
- En uso activo: 6 (50%)
- Mock data: 2 (17%)
- Huérfanos: 3 (25%)
- Apoyo: 1 (8%)

### Colecciones
- Definidas en Rules: 15
- Accedidas en Código: 11
- Desajustes críticos: 3
- Sin usar: 4
- Vacías/Sin inicializar: 5

### Problemas
- Críticos: 3
- Moderados: 5
- Leves: 1

---

## VERIFICACIÓN RÁPIDA

```bash
# Buscar en el código:
grep -r "collection(db," src/services/*.ts

# Esperado:
# ✅ profiles
# ✅ users (solo en authService)
# ✅ retos
# ✅ retos/{retoId}/publicaciones  (IMPORTANTE: subcollection)
# ✅ validaciones
# ✅ logsActividad
# ✅ leaderboard
# ✅ preguntas
# ✅ respuestas
# ✅ quizAttempts

# ❌ NO DEBE HABER:
# ❌ interactions (debe ser: interacciones)
# ❌ posts (debe tener reglas o migrarse)
# ❌ publicacionesRetos (debe ser subcollection de retos)
```

