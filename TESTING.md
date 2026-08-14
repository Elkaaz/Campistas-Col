# ✅ TESTING - RED SOCIAL GAMIFICADA

Guía completa para probar todas las funcionalidades de la red social.

## 🚀 PREPARACIÓN

### 1. Configurar Firebase Admin SDK (para seeders)

```bash
# Descargar serviceAccountKey.json de Firebase Console
# Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada
# Guardar en raíz del proyecto como: serviceAccountKey.json
```

### 2. Cargar datos iniciales

```bash
# Ejecutar seeders
node seeders/seed-all.mjs

# Esto carga:
# ✅ 6 Niveles (Semilla → Fruto)
# ✅ 5 Retos base
# ✅ 8 Cartillas
# ✅ 3 Municipios
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Acceder a: `http://localhost:5173`

---

## 📋 CASOS DE PRUEBA

### TEST 1: HomePage - El Fogón

**Objetivo**: Verificar que carga posts desde Firestore

**Pasos**:
1. Navegar a `/` (HomePage)
2. Esperar a que cargue el feed social
3. Verificar:
   - ✅ Se muestran posts validados
   - ✅ Filtros funcionan (Todos, Nudos, Refugios, etc)
   - ✅ Cada post muestra:
     - Nombre del autor
     - Nivel con color dinámico
     - Título y descripción
     - Imagen de ejemplo
     - Contadores de 🔥 y 🪢

**Resultado esperado**:
```
El Fogón cargó correctamente (por ahora mostrará "No hay publicaciones aún" 
hasta que haya posts en Firestore)
```

---

### TEST 2: LeaderboardPage - Ranking Global

**Objetivo**: Verificar que carga usuarios desde Firestore

**Pasos**:
1. Navegar a `/leaderboard`
2. Esperar a que cargue el ranking
3. Verificar:
   - ✅ Se muestran usuarios ordenados por XP
   - ✅ Top 3 tienen medallas (🥇🥈🥉)
   - ✅ Cada usuario muestra:
     - Rank/posición
     - Nombre y avatar
     - Nivel con color
     - XP total
     - Medallas

**Resultado esperado**:
```
Leaderboard cargó correctamente (por ahora mostrará "No hay campistas aún" 
hasta que haya usuarios en Firestore)
```

---

### TEST 3: PublicarRetoPage - Crear Post

**Objetivo**: Verificar que se puede crear un post nuevo

**Pasos**:
1. Desde HomePage, hacer clic en FAB (+) para publicar
2. Rellenar formulario:
   - Título: "Mi primer reto 🔥"
   - Descripción: "Completé el reto con éxito"
   - Seleccionar imagen
3. Hacer clic en "Publicar Reto"
4. Verificar:
   - ✅ Alert de éxito
   - ✅ Post creado en Firestore (estado: pendiente_validacion)
   - ✅ Redirección a HomePage

**Resultado esperado**:
```
✅ Reto publicado exitosamente. Pendiente de validación por líder.
(Post visible en Firestore Console con estado "pendiente_validacion")
```

---

### TEST 4: Interacciones - Fogatas y Nudos

**Objetivo**: Verificar que se pueden agregar reacciones

**Pasos**:
1. Desde HomePage, en cualquier PostCard:
2. Hacer clic en botón 🔥 (fogata)
3. Hacer clic en botón 🪢 (nudo)
4. Verificar:
   - ✅ Contadores incrementan
   - ✅ Reacciones se guardan en Firestore
   - ✅ Al recargar, contadores persisten

**Resultado esperado**:
```
Los contadores de fogatas y nudos aumentan y se guardan
```

---

## 🧪 PRUEBAS TÉCNICAS

### Verificar Firestore Console

1. Abrir [Firebase Console](https://console.firebase.google.com)
2. Seleccionar proyecto: `campistas-col`
3. Ir a Firestore → Datos

**Verificar colecciones**:

```
✅ profiles/
   └─ (vacío hasta crear usuarios)

✅ posts/
   └─ {postId} con estado: "pendiente_validacion"

✅ interactions/
   └─ (fogatas y nudos)

✅ levels/
   ├─ semilla (🌱)
   ├─ raiz (🌿)
   ├─ tallo (🌾)
   ├─ hoja (🍃)
   ├─ flor (🌸)
   └─ fruto (🍎)

✅ retos/
   ├─ reto_1: Fogata Segura
   ├─ reto_2: Nudo Básico
   ├─ reto_3: Refugio Emergencia
   ├─ reto_4: Huerta Sostenible
   └─ reto_5: Primeros Auxilios

✅ cartillas/ (8 documentos)

✅ municipios/ (3 documentos)
```

---

### Verificar Console del Navegador

1. Abrir DevTools (`F12`)
2. Ir a pestaña Console
3. No debe haber errores rojos
4. Los logs deben mostrar:
   ```
   ✅ Servicios Firebase conectados
   ✅ Queries ejecutadas correctamente
   ✅ Datos transformados sin errores
   ```

---

## 📊 CHECKLIST DE TESTING

### FASE 1: Estructura
- [ ] Build sin errores: `npm run build`
- [ ] App inicia sin crashes: `npm run dev`
- [ ] Rutas funcionan (/home, /leaderboard, /retos, /retos/1/publicar)

### FASE 2: Servicios Firebase
- [ ] `postsService.getFeedSocial()` retorna posts validados
- [ ] `postsService.getPostsByType()` filtra por tipo
- [ ] `profileService.getLeaderboard()` retorna usuarios ordenados
- [ ] `interactionsService.addInteraction()` incrementa contadores

### FASE 3: UI Integration
- [ ] HomePage carga posts del servicio
- [ ] LeaderboardPage carga usuarios del servicio
- [ ] PublicarRetoPage puede crear posts
- [ ] Interacciones (🔥🪢) funcionan correctamente

### FASE 4: Data Persistence
- [ ] Posts se guardan en Firestore
- [ ] Reacciones se guardan y persisten
- [ ] Niveles y retos están cargados
- [ ] Municipios están disponibles

---

## 🐛 DEBUGGING

### Si HomePage no carga posts:
```javascript
// En Console del navegador
firebase.firestore().collection('posts')
  .where('estado', '==', 'validado')
  .orderBy('createdAt', 'desc')
  .limit(20)
  .get()
  .then(snapshot => console.log(snapshot.docs.length + ' posts'))
```

### Si LeaderboardPage no carga usuarios:
```javascript
firebase.firestore().collection('profiles')
  .where('activo', '==', true)
  .orderBy('xpTotal', 'desc')
  .limit(100)
  .get()
  .then(snapshot => console.log(snapshot.docs.length + ' usuarios'))
```

### Ver logs de servicios:
```javascript
// Ya están en Console automáticamente cuando hay errores
// Buscar: "Error loading posts" o similar
```

---

## ✨ SIGUIENTE PASO

Una vez que todos los tests pasen:
1. Conectar autenticación Firebase Auth
2. Crear componentes de perfil editable
3. Implementar validación de posts por líderes
4. Agregar subida de imagenes a Cloud Storage
5. Hacer deploy a producción

---

**Fecha**: Agosto 2026
**Versión**: 1.0
**Estado**: Listo para testing
