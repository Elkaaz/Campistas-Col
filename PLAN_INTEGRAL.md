# 📋 Plan Integral — Red Campista Col
> Documento vivo del proyecto. No borrar. Actualizar con cada avance real.
> Versión actualizada: nombre oficial del feed social = **Zona de Fogata**.

---

## 1. Estado actual del proyecto

### Stack
- **Frontend**: React 18 + TypeScript + Vite + React Router 6
- **Backend**: Firebase Auth + Firestore
- **Hosting**: Firebase Hosting (`campistas-col.web.app`)
- **Imágenes**: Cloudinary (`io57lpw`, preset `Campistas-col`, upload unsigned)
- **Repo**: GitHub → `https://github.com/Elkaaz/Campistas-Col.git`

### Features implementadas
- Landing page con fondo campamentil y niveles visuales
- Auth: email/contraseña + Google (`loginWithGoogle`)
- Zona de Fogata (feed social) con filtros y paginación
- Detalle de post + comentarios
- Follow/unfollow + búsqueda de campistas
- Notificaciones in-app
- Cartillas y Quizzes (páginas de lista)
- Calendario de eventos
- Registro de horas de servicio
- Dashboard con actividad reciente
- Bottom nav móvil + navbar con búsqueda rápida
- Firestore rules + índices compuestos deployados
- `.gitignore` protegido contra secrets
- **Fase 1**: Nombres unificados (`Zona de Fogata`, `Ranking`, `Formación`), active states corregidos, ProfileForm extendido con redes sociales, habilidades, documento, fecha nacimiento, insignias en dashboard
- **Fase 2**: Cartillas con metadata de progresión (`xpAlCompletar`, `insigniaOtorgada`, `nivelMinimo`, `rolHabilita`, `requisitosPrevios`), `ProfileInsignias` component, helpers `getCartillasByRol/Nivel`
- **Fase 3**: Perfil público con tabs (Info, Actividad, Retos, Formación), datos generales, verificación pública
- **Fase 4**: `RoleBadge` componente reutilizable, jerarquía visible de roles con colores/emojis en perfil público, dashboard y posts validados
- **Fase 5**: Service Worker básico (`public/sw.js`), manifest.json para PWA, `ConnectionStatus` component, `offlineQueue` para acciones offline (publicar reto, registrar servicio)
- Build actual: `npm run build` pasa (176 módulos, ~811 kB JS)
- **Fase 5**: Service Worker básico (`public/sw.js`), manifest.json para PWA, `ConnectionStatus` component, `offlineQueue` para acciones offline (publicar reto, registrar servicio)

### Datos sensibles
- `firebase-sa.json` **no está en disco ni en git**; solo queda como prevención en `.gitignore`

---

## 2. Diagnóstico

### A. Nombres y navegación inconsistentes
- En la captura, la navbar muestra rutas cortas, pero el hero del feed aún usa mezcla de términos.
- Debe usarse **Zona de Fogata** como nombre oficial del feed.
- Rutas: `/fogon` se mantiene como URL, pero en UI debe decir **Zona de Fogata**.
- La landing redirige a `/fogon` post-login; eso está bien, pero el texto visible debe ser consistente.

### B. Errores de selección/botones (desde la captura)
- Los botones de filtro del feed deben mostrar estado activo consistente.
- La navbar y bottom nav deben marcar claramente la sección actual.
- El FAB verde debe ir ligado a la acción principal de la sección activa.

### C. Perfil de campista incompleto
- `types/user.ts` define campos como `redesSociales`, `habilidadEspecial`, `nombreBosque`, pero no hay formulario ni UI para editarlos.
- No existe mapeo real de **rol → responsabilidades** ni cómo un nivel/cartilla transforma tu rol en el movimiento.
- No hay forma de que un usuario vea “mi progreso hacia Líder de Bosque” ni “qué me falta para Comité Departamental”.

### D. Falta mística campamentil
- No hay jerarquía visible tipo scout en la UI.
- No hay insignias beyond “nivel”.
- No hay “tablero de recuerdos” como pediste.
- No hay vinculación explícita entre cartillas y rol/nivel: hoy el nivel es casi decorativo.

### E. Roles sin impacto real
- `campista`, `lider_bosque`, `comite_departamental`, `admin` existen en el modelo, pero no tienen UI, permisos visibles ni flujos diferenciados.

---

## 3. Captura de pantalla — observaciones directas

> Imagen referida: pantalla principal luego de login.

- Navbar muestra: **Campistas Col**, buscador, **El Fogón**, **Mi Bosque**, **Mi Aprendizaje**, **Retos**, **Niveles**, **Leaderboard**, **Semilla**, notificaciones, usuario **kevin**.
- Hero del feed muestra: **🔥 El Fogón** y el texto “Muro de retos completados por campistas de toda Colombia”.
- Filtros visibles: **Todos**, y varios iconos de tipo de reto.
- Primer post visible: imagen de campistas con gorras rojas.
- FAB verde abajo a la derecha.

### Correcciones requeridas desde esta captura
1. Unificar nombre oficial de la sección: usar siempre **Zona de Fogata** (ruta `/fogon`).
2. Revisar active states en navbar y bottom nav al entrar a `/fogon`.
3. Confirmar que los filtros de tipo de reto se vean correctamente alineados y con estados activos consistentes.
4. El FAB debe llevar a la acción correcta según la sección.

---

## 4. Cartillas — conocimiento base de la red

> Fuente: `src/config/cartillasLinks.ts`

Las cartillas son el eje de conocimiento oficial de Campamentos Juveniles Colombia.

### Cartillas actuales
1. **Técnicas Campamentiles**
   - Icono: `⛺`
   - Color: `#228B22`
   - Aporta: nudos, refugios, fogatas, supervivencia básica

2. **Prevención y Salud**
   - Icono: `🏥`
   - Color: `#DC143C`
   - Aporta: primeros auxilios, seguridad, emergencias

3. **Conciencia Ambiental**
   - Icono: `🌍`
   - Color: `#2E8B57`
   - Aporta: cuidado del entorno, residuos, reforestación

4. **Formación, Crecimiento Personal, Voluntariado y Liderazgo**
   - Icono: `👥`
   - Color: `#4169E1`
   - Aporta: liderazgo juvenil, trabajo en equipo, servicio

5. **Guía Técnica - Programa Campamentos Juveniles**
   - Icono: `📖`
   - Color: `#FF6347`
   - Aporta: marco normativo y técnico del programa

### Análisis de colores y mística campamentil
- Verde `#228B22` y `#2E8B57` → naturaleza y técnicas, apropiados.
- Rojo `#DC143C` → salud/emergencia, alerta, válido.
- Azul `#4169E1` → formación y liderazgo, claro.
- Rojo tomate `#FF6347` → guía técnica, funciona como acento.
- **Conclusión**: los colores están bien diferenciados por tema, pero deben usarse con consistencia:
  - Cada cartilla debe mantener su color en card, badge, progreso y quiz.
  - Ese color debe trasladarse al nivel/rol que habilita, para crear coherencia visual entre formación y jerarquía.

### Cómo deben usarse las cartillas en la red social
- Cada cartilla debe tener:
  - Nivel mínimo sugerido
  - Rol que habilita o fortalece
  - Insignia asociada
  - Tiempo estimado de formación
  - Quiz de validación del conocimiento
- El progreso en cartillas debe verse en:
  - Perfil público
  - Dashboard
  - Posibles requisitos para validar retos o eventos

---

## 5. Cambios de nombres y lenguaje unificado

### Términos oficiales
- `/fogon` (URL) → UI: **Zona de Fogata**
- `/bosque` → **Mi Bosque**
- `/aprendizaje` → **Formación**
- `/retos` → **Retos**
- `/niveles` → **Niveles**
- `/leaderboard` → **Ranking**
- Publicación de reto completado → **Publicar reto**
- Usuario → **Campista**
- Grupo scout → **Bosque**
- Evento → **Campamento / Jornada / Taller / Brigada**
- Insignia → **Insignia**
- Cartilla → **Cartilla de Formación**
- Nivel → **Nivel de Formación**

### Regla
- No mezclar nombres. En UI, código, notificaciones y docs debe decir **Zona de Fogata** para `/fogon`.
- El hero del feed debe decir siempre **Zona de Fogata**.
- La navbar debe decir **Zona de Fogata**.
- El bottom nav debe decir **Fogata** (versión corta) para mantener espacio móvil.

---

## 6. Arquitectura objetivo

```
Perfil de Campista (núcleo)
 ├── XP + Nivel
 ├── Rol + Responsabilidades
 ├── Insignias
 └── Redes sociales / bosque

Sistema circulatorio
 ├── Notificaciones
 ├── Followers / Following
 ├── Comentarios
 └── Reacciones (fogata/nudo)

Sistema nervioso
 ├── Feed social
 ├── Eventos en tiempo real
 ├── Calendario
 └── Búsqueda

Sistema inmunológico
 ├── Validación de líderes
 ├── Reportes
 └── Reglas de seguridad

Memoria
 ├── Cartillas completadas
 ├── Historial de servicio
 ├── Tablero de recuerdos
 └── Progreso por nivel/rol
```

---

## 7. Plan por fases

### Fase 1 — Lenguaje, navegación y correcciones (esta semana)
**Objetivo**: que la app se sienta coherente y no tenga errores visuales.

1. Unificar términos oficiales:
   - `/fogon` = **Zona de Fogata**
   - `/bosque` = **Mi Bosque**
   - `/aprendizaje` = **Formación**
   - Perfil público = **Perfil de Campista**
2. Arreglar active states en navbar, bottom nav y filtros.
3. Corregir alineaciones y hover feedback en botones.

### Fase 2 — Cartillas como núcleo de conocimiento (próxima semana)
**Objetivo**: que las cartillas dejen de ser links sueltos y pasen a ser el motor de progresión.

1. Reestructurar `CartillasPage`:
   - Mostrar cartilla como “lección” con índice, tiempo de lectura y progreso.
   - Vincular cada cartilla a **niveles** y **roles**.
   - Agregar requisitos previos: “Para Tallo necesitas: Técnicas + Primeros Auxilios”.
2. Sistema de **insignias**:
   - Metadata en `types/cartilla.ts`: `insigniaOtorgada`, `xpAlCompletar`, `nivelMinimo`.
   - UI de insignias en perfil público y dashboard.
3. Crear la relación explícita:
   - `cartilla → nivel_requerido → rol_desbloqueable → responsabilidades`

### Fase 3 — Perfil extendido y verificación pública (1 semana)
**Objetivo**: que cualquier campista pueda ver quién es otro, su actividad y su credibilidad.

1. Ampliar `ProfileForm` con:
   - Avatar
   - Redes sociales / link del bosque
   - `nombreBosque` / grupo scout
   - Habilidades especiales
   - Tipo de documento, número, fecha de nacimiento
2. Perfil público con pestañas:
   - Info
   - Actividad
   - Retos publicados
   - Cartillas / insignias
3. Indicadores visibles:
   - Rol + nivel + insignias en el encabezado del perfil
   - “Verificado por Líder [nombre]” en retos validados

### Fase 4 — Mística campamentil y roles vivos (2 semanas)
**Objetivo**: que la app se sienta como un organismo scout funcional.

1. **Jerarquía visible**:
   - Cada rol tiene color/insignia propia.
   - Flujos diferenciados:
     - `campista`: publica retos, aprende, sirve
     - `lider_bosque`: valida retos, lidera bosque, crea eventos locales
     - `comite_departamental`: eventos departamentales, reportes
     - `admin`: panel total
2. **Tablero de recuerdos en Zona de Fogata**:
   - Posts tipo “álbum de campamento” agrupables por evento.
   - Cada campista agrega fotos/recuerdos a un campamento específico.
   - Colecciones visuales por campamento.
3. **Grupos/Bosques**:
   - Cada campista puede crear/unirse a un bosque.
   - Muro privado, eventos propios, líder asignado.
4. **Niveles ↔ Cartillas ↔ Roles**:
   - Nivel = experiencia acumulada.
   - Cartilla = conocimiento obligatorio para ciertos niveles/roles.
   - Rol = responsabilidades activas en la red.

### Fase 5 — Modo offline y pulido final (1 semana)
**Objetivo**: que funcione en zonas sin internet del campo.

1. Service worker / PWA basics.
2. Cola de acciones offline (publicar reto, registrar servicio) con sync al volver.
3. Optimización de imágenes para campo.
4. Pruebas end-to-end del flujo completo.

---

## 8. Estado actual

Fases 1 a 5 completadas. Build actual: `npm run build` pasa.

### Fase 1 — Lenguaje, navegación y correcciones
- Unificar términos oficiales: `/fogon` = **Zona de Fogata**, `/bosque` = **Mi Bosque**, `/aprendizaje` = **Formación**, `/leaderboard` = **Ranking**
- Arreglar active states en navbar, bottom nav y filtros.
- Corregir alineaciones y hover feedback en botones.
- Ampliar `ProfileForm` con campos faltantes: avatar, redes sociales, `nombreBosque`, `habilidadEspecial`, `tipoDocumento`, `documento`, `fechaNacimiento`.
- Empezar a modelar las **insignias** en `types/cartilla.ts`.

### Fase 2 — Cartillas como núcleo de conocimiento
- Reestructurar `CartillasPage`: mostrar cartilla como “lección” con índice, tiempo de lectura y progreso.
- Vincular cada cartilla a **niveles** y **roles**.
- Metadata en `config/cartillasLinks.ts`: `insigniaOtorgada`, `xpAlCompletar`, `nivelMinimo`, `rolHabilita`, `requisitosPrevios`.
- Sistema de **insignias**: `ProfileInsignias` component en `Mi perfil`.
- Crear la relación explícita: `cartilla → nivel_requerido → rol_desbloqueable → responsabilidades`.

### Fase 3 — Perfil extendido y verificación pública
- Ampliar `ProfileForm` con: avatar, redes sociales, `nombreBosque`, `habilidadEspecial`, tipo de documento, número, fecha de nacimiento.
- Perfil público con pestañas: Info, Actividad, Retos, Formación.
- Indicadores visibles: Rol + nivel + insignias en el encabezado del perfil.
- “Verificado por Líder [nombre]” en retos validados.

### Fase 4 — Mística campamentil y roles vivos
- **Jerarquía visible**: `RoleBadge` componente reutilizable con colores/emojis por rol.
- Flujos diferenciados: `campista`, `lider_bosque`, `comite_departamental`, `admin`.
- Roles con impacto real en UI: perfil público, dashboard, posts validados.

### Fase 5 — Modo offline y pulido final
- Service worker básico (`public/sw.js`) con cache-first strategy.
- Manifest.json para PWA install.
- `ConnectionStatus` component para indicar estado offline.
- `offlineQueue` para encolar acciones (publicar reto, registrar servicio) y sync al reconectar.
- Build actual: `npm run build` pasa (176 módulos, ~811 kB JS).
