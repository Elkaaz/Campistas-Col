# 📝 CREAR NIVELES EN FIREBASE - PASO A PASO MANUAL

## ¿Por Qué Manual?

El seeder de Node.js requiere dependencias complejas. Es más rápido y confiable crearlos directamente en Firebase Console (5 minutos).

---

## 🎯 PASOS INMEDIATOS

### 1. Abrir Firebase Console

```
https://console.firebase.google.com/project/campistas-col/firestore/data
```

### 2. Crear Colección `levels`

- Click en "+ Start collection"
- Collection ID: `levels`
- Click "Next"
- Auto-ID: Enable
- Click "Save"

### 3. Crear 6 Documentos

Para cada nivel, click "+ Add document" y agrega los datos:

---

## 📊 LOS 6 NIVELES

### NIVEL 1: Semilla

**Document ID**: `semilla`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 1 |
| nombre | string | Semilla |
| descripcion | string | Aspirante nuevo, comienza tu aventura campista |
| color | string | #8B7355 |
| colorSecundario | string | #D2B48C |
| icono | string | 🌱 |
| xpRequerida | number | 0 |
| xpParaSiguiente | number | 500 |

---

### NIVEL 2: Raíz

**Document ID**: `raiz`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 2 |
| nombre | string | Raíz |
| descripcion | string | Consolidando base de habilidades campistas |
| color | string | #654321 |
| colorSecundario | string | #A0693D |
| icono | string | 🌿 |
| xpRequerida | number | 500 |
| xpParaSiguiente | number | 1500 |

---

### NIVEL 3: Tallo

**Document ID**: `tallo`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 3 |
| nombre | string | Tallo |
| descripcion | string | Creciendo en experiencia y liderazgo |
| color | string | #228B22 |
| colorSecundario | string | #32CD32 |
| icono | string | 🌾 |
| xpRequerida | number | 1500 |
| xpParaSiguiente | number | 3500 |

---

### NIVEL 4: Hoja

**Document ID**: `hoja`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 4 |
| nombre | string | Hoja |
| descripcion | string | Dominando técnicas avanzadas |
| color | string | #2E8B57 |
| colorSecundario | string | #3CB371 |
| icono | string | 🍃 |
| xpRequerida | number | 3500 |
| xpParaSiguiente | number | 7500 |

---

### NIVEL 5: Flor

**Document ID**: `flor`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 5 |
| nombre | string | Flor |
| descripcion | string | Lider experimentado y mentor |
| color | string | #FF1493 |
| colorSecundario | string | #FF69B4 |
| icono | string | 🌸 |
| xpRequerida | number | 7500 |
| xpParaSiguiente | number | 15000 |

---

### NIVEL 6: Fruto

**Document ID**: `fruto`

**Fields**:
| Campo | Tipo | Valor |
|-------|------|-------|
| orden | number | 6 |
| nombre | string | Fruto |
| descripcion | string | Máximo nivel - Autoridad campista |
| color | string | #FF4500 |
| colorSecundario | string | #FFD700 |
| icono | string | 🍎 |
| xpRequerida | number | 15000 |
| xpParaSiguiente | number | 999999 |

---

## ✅ COMO HACERLO EN FIREBASE CONSOLE

### Para cada nivel:

1. **Abrir Firebase Console**
   ```
   https://console.firebase.google.com/project/campistas-col/firestore/data/levels
   ```

2. **Click "+ Add document"**

3. **Ingresar Document ID** (ej: `semilla`)

4. **Agregar campos**:
   - Click "+ Add field"
   - Nombre del campo (ej: `orden`)
   - Tipo (ej: `number`)
   - Valor (ej: `1`)
   - Click "✓"

5. **Repetir para todos los campos**

6. **Click "Save"**

7. **Repetir para los otros 5 niveles**

---

## ⏱️ TIEMPO ESTIMADO

- **Por nivel**: 2 minutos
- **TOTAL (6 niveles)**: 12 minutos

---

## ✨ RESULTADO

Después de terminar, en Firebase Console verás:

```
Firestore → Data → levels (collection)
├── semilla (document)
│   ├── orden: 1
│   ├── nombre: "Semilla"
│   ├── color: "#8B7355"
│   └── ... (resto de campos)
├── raiz (document)
├── tallo (document)
├── hoja (document)
├── flor (document)
└── fruto (document)
```

---

## 🚀 PRÓXIMO PASO

Después de crear los niveles:

```powershell
firebase deploy
```

Esto desplegará los niveles a Firebase Hosting.

---

## 💡 ALTERNATIVAS

### Si quieres usar script Node.js:

Se requiere instalar Firebase Admin SDK correctamente:

```powershell
npm install firebase-admin --save
node seeders/seed-levels.mjs
```

Pero es más complicado, por eso recomendamos hacerlo manualmente en Console.

---

**Status**: Manual creation ready
**Tiempo**: 12 minutos
**Próximo**: Deploy a Hosting
