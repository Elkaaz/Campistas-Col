# 📊 CONFIGURAR NIVELES EN FIREBASE

## ¿Qué son los Niveles?

Los niveles son la estructura de gamificación de la red social:

```
Semilla (1)     → Raíz (2)     → Tallo (3)    → Hoja (4)    → Flor (5)    → Fruto (6)
🌱              🌿             🌾             🍃            🌸            🍎
0-500 XP        500-1500       1500-3500      3500-7500     7500-15000    15000+
```

---

## 📋 Lo Que Falta

Crear una **colección `levels`** en Firestore con 6 documentos, uno por cada nivel.

Cada documento contiene:
- Nombre del nivel
- Descripción
- Colores (primario + secundario)
- Emoji/icono
- XP requerida
- XP para siguiente nivel

---

## ✅ OPCIÓN 1: Automático (Recomendado)

### Paso 1: Verificar serviceAccountKey.json

El archivo `serviceAccountKey.json` debe existir en la raíz del proyecto.

**Ubicación esperada:**
```
campistas-firebase/serviceAccountKey.json
```

Si **NO existe**, descárgalo de Firebase:

1. Firebase Console → Project Settings (engranaje)
2. Service Accounts tab
3. Click "Generate New Private Key"
4. Guarda el archivo como `serviceAccountKey.json` en raíz del proyecto

### Paso 2: Ejecutar Seeder

En PowerShell:

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"

# Ejecutar el seeder de niveles
node seeders/seed-levels.mjs
```

**Resultado esperado:**
```
🌱 Iniciando seed de niveles...

✅ Nivel 'Semilla' creado
✅ Nivel 'Raíz' creado
✅ Nivel 'Tallo' creado
✅ Nivel 'Hoja' creado
✅ Nivel 'Flor' creado
✅ Nivel 'Fruto' creado

✅ Seed de niveles completado exitosamente
```

---

## ✅ OPCIÓN 2: Manual (Firebase Console)

Si prefieres hacerlo manualmente:

### Paso 1: Abrir Firestore

Firebase Console → Firestore → Data

### Paso 2: Crear Colección `levels`

1. Click "+ Start collection"
2. Collection ID: `levels`
3. Click "Next"
4. Auto-ID: Enable
5. Click "Save"

### Paso 3: Crear Documentos

Para cada nivel, crear un documento:

#### Documento 1: semilla
```
Document ID: semilla

Fields:
- orden: 1 (number)
- nombre: "Semilla" (string)
- descripcion: "Aspirante nuevo, comienza tu aventura campista" (string)
- color: "#8B7355" (string)
- colorSecundario: "#D2B48C" (string)
- icono: "🌱" (string)
- xpRequerida: 0 (number)
- xpParaSiguiente: 500 (number)
```

#### Documento 2: raiz
```
Document ID: raiz

Fields:
- orden: 2 (number)
- nombre: "Raíz" (string)
- descripcion: "Consolidando base de habilidades campistas" (string)
- color: "#654321" (string)
- colorSecundario: "#A0693D" (string)
- icono: "🌿" (string)
- xpRequerida: 500 (number)
- xpParaSiguiente: 1500 (number)
```

#### Documento 3: tallo
```
Document ID: tallo

Fields:
- orden: 3 (number)
- nombre: "Tallo" (string)
- descripcion: "Creciendo en experiencia y liderazgo" (string)
- color: "#228B22" (string)
- colorSecundario: "#32CD32" (string)
- icono: "🌾" (string)
- xpRequerida: 1500 (number)
- xpParaSiguiente: 3500 (number)
```

#### Documento 4: hoja
```
Document ID: hoja

Fields:
- orden: 4 (number)
- nombre: "Hoja" (string)
- descripcion: "Dominando técnicas avanzadas" (string)
- color: "#2E8B57" (string)
- colorSecundario: "#3CB371" (string)
- icono: "🍃" (string)
- xpRequerida: 3500 (number)
- xpParaSiguiente: 7500 (number)
```

#### Documento 5: flor
```
Document ID: flor

Fields:
- orden: 5 (number)
- nombre: "Flor" (string)
- descripcion: "Lider experimentado y mentor" (string)
- color: "#FF1493" (string)
- colorSecundario: "#FF69B4" (string)
- icono: "🌸" (string)
- xpRequerida: 7500 (number)
- xpParaSiguiente: 15000 (number)
```

#### Documento 6: fruto
```
Document ID: fruto

Fields:
- orden: 6 (number)
- nombre: "Fruto" (string)
- descripcion: "Máximo nivel - Autoridad campista" (string)
- color: "#FF4500" (string)
- colorSecundario: "#FFD700" (string)
- icono: "🍎" (string)
- xpRequerida: 15000 (number)
- xpParaSiguiente: 999999 (number)
```

---

## 📊 Estructura de Datos

### Colección: `levels`

```
levels/
├── semilla/
│   ├── orden: 1
│   ├── nombre: "Semilla"
│   ├── descripcion: "..."
│   ├── color: "#8B7355"
│   ├── colorSecundario: "#D2B48C"
│   ├── icono: "🌱"
│   ├── xpRequerida: 0
│   └── xpParaSiguiente: 500
│
├── raiz/
│   ├── orden: 2
│   ├── nombre: "Raíz"
│   └── ... (similar)
│
├── tallo/ (orden: 3)
├── hoja/ (orden: 4)
├── flor/ (orden: 5)
└── fruto/ (orden: 6)
```

---

## 🎯 Cómo Se Usa en la App

### 1. En Componentes

```tsx
// En NivelBadge.tsx
const niveles = await db.collection('levels').doc(userNivel).get()
const nivelData = niveles.data()

// Usar colores, nombres, descripciones
<div style={{ backgroundColor: nivelData.color }}>
  {nivelData.icono} {nivelData.nombre}
</div>
```

### 2. En Leaderboard

```tsx
// Ordenar por XP y determinar nivel
const userXP = 2000 // XP del usuario
const nivelActual = // Determinar basado en XP
```

### 3. En Perfiles

Mostrar:
- Nivel actual (nombre + icono)
- XP actual
- Progreso a siguiente nivel

---

## ✅ CHECKLIST

- [ ] serviceAccountKey.json descargado (si usa opción automática)
- [ ] Firestore Database creada en Firebase Console
- [ ] Ejecutar: `node seeders/seed-levels.mjs` O crear manualmente
- [ ] Verificar en Firebase Console → Firestore → Data
- [ ] Ver 6 documentos en collection `levels`
- [ ] Cada documento con todos los campos

---

## 🔄 Otros Seeders Disponibles

Además de `seed-levels.mjs`, hay más:

```powershell
# Seeder de cartillas (educativo)
node seeders/seed-cartillas.mjs

# Seeder de retos/challenges
node seeders/seed-retos.mjs

# Seeder de municipios
node seeders/seed-municipios.mjs

# Ejecutar TODOS los seeders
npm run seed
# O
node seeders/seed-all.mjs
```

---

## ⚠️ IMPORTANTE

### Para Test Mode (Ahora):
- Cualquiera puede leer y escribir
- OK para desarrollo

### Para Production Mode (Después):
- Solo backend puede escribir
- Usuarios solo pueden leer
- Usar reglas en `firestore.rules`

---

## 🚀 Próximos Pasos

Después de configurar niveles:

1. **Ejecutar otros seeders**
   ```powershell
   npm run seed
   ```

2. **Crear usuarios de prueba**
   Firebase Console → Authentication → Add User

3. **Implementar Fase 5: Authentication**
   - LoginPage
   - SignupPage
   - Asignar nivel inicial (semilla) a nuevos usuarios

---

## 📝 Resumen

**Rápido (2 minutos):**
1. Descargar serviceAccountKey.json
2. Ejecutar: `node seeders/seed-levels.mjs`
3. Listo

**Manual (5 minutos):**
1. Firebase Console → Firestore
2. Crear colección `levels`
3. Crear 6 documentos (uno por nivel)
4. Listo

**Verificar:**
Firebase Console → Firestore → Collection `levels` → 6 documentos

---

**Status**: 📊 Niveles listos para configurar
**Próximo**: Deploy a Firebase + Auth (Fase 5)
