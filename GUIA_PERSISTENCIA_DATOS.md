# 💾 GUÍA: CÓMO GUARDAR DATOS EN FIRESTORE

## 1️⃣ FLUJO COMPLETO DE DATOS

### Cuando un campista se registra:

```
UI (RegisterForm)
    ↓
    authService.registerUser()
    ↓
    Firebase Auth crea usuario
    ↓
    Firestore crea:
    - users/{uid} ← datos de rol
    - profiles/{uid} ← datos del campista
```

### Cuando completa perfil:

```
UI (ProfileForm)
    ↓
    campistaProfileService.completeCampistaProfile()
    ↓
    Firestore actualiza profiles/{uid}
    ├── tipoSangre
    ├── eps
    ├── alergias
    ├── contactoEmergencia
    ├── bio
    ├── departamento
    └── perfilCompleto: true
```

### Cuando publica un reto:

```
UI (ChallengePage)
    ↓
    retosService.publicarSolucionReto()
    ↓
    Firestore crea:
    ├── retos/{retoId}/publicaciones/{pubId}
    │   ├── uid: "campista123"
    │   ├── evidencia: "foto/url/descripción"
    │   ├── estado: "pendiente"
    │   └── createdAt: timestamp
    │
    └── logsActividad/{logId}
        ├── uid: "campista123"
        ├── tipo: "RETO_PUBLICADO"
        └── datos: {...}
```

### Cuando un líder valida:

```
UI (AdminPage)
    ↓
    retosService.validarSolucionReto()
    ↓
    Firestore actualiza:
    ├── retos/{retoId}/publicaciones/{pubId}
    │   ├── estado: "validado"
    │   ├── validadorUid: "lider123"
    │   └── validadoEn: timestamp
    │
    ├── profiles/{uid}
    │   └── xpTotal: (incrementa por XP del reto)
    │
    └── validaciones/{validacionId}
        ├── publicacionId: "pub123"
        ├── uid: "campista123"
        ├── validadorUid: "lider123"
        ├── aprobado: true
        ├── xpAsignado: 80
        └── createdAt: timestamp
```

---

## 2️⃣ ESTRUCTURA DE CARPETAS EN FIRESTORE

Tu proyecto usa esta estructura (ya está en `src/lib/firebaseSchema.ts`):

```typescript
const FIREBASE_COLLECTIONS = {
  users: 'users',           // Roles y permisos
  profiles: 'profiles',     // Datos del campista (lo más importante)
  levels: 'levels',         // Tabla de niveles (lectura)
  retos: 'retos',          // Desafíos disponibles
  validaciones: 'validaciones',  // Aprobaciones de retos
  logsActividad: 'logsActividad', // Auditoría
  leaderboard: 'leaderboard'  // Rankings (generado por Cloud Functions)
}
```

---

## 3️⃣ CÓMO OBTENER CREDENCIALES DE FIREBASE

### En Firebase Console:

1. Ve a tu proyecto "Campistas-Col"
2. Click en ⚙️ (arriba a la izquierda)
3. Selecciona "Configuración del proyecto"
4. Tab "Tus apps"
5. Busca la app con nombre "Campistas-firebase" (o la web)
6. Click en el icono `</>`
7. Verás el `firebaseConfig` objeto:

```javascript
// Ejemplo (NO uses estos, son falsos)
const firebaseConfig = {
  apiKey: "AIzaSyA_B1a2b3c4d5e6f7g8h9i0jklmno",
  authDomain: "campistas-col.firebaseapp.com",
  projectId: "campistas-col",
  storageBucket: "campistas-col.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8",
  measurementId: "G-ABCDEFGHIJ"
};
```

8. Copia estos valores al archivo `.env.local` en tu proyecto:

```env
VITE_FIREBASE_API_KEY=AIzaSyA_B1a2b3c4d5e6f7g8h9i0jklmno
VITE_FIREBASE_AUTH_DOMAIN=campistas-col.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campistas-col
VITE_FIREBASE_STORAGE_BUCKET=campistas-col.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:a1b2c3d4e5f6g7h8
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

---

## 4️⃣ CÓMO FUNCIONA LA PERSISTENCIA DE DATOS

### En `src/firebase.ts`:

```typescript
// Lee las variables de entorno
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
}

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Para login/registro
export const db = getFirestore(app);  // Para base de datos
export const storage = getStorage(app);  // Para archivos
```

### Cuando guardas datos (ejemplo):

```typescript
// En campistaProfileService.ts
export async function completeCampistaProfile(
  uid: string,
  profileData: Partial<CampistaProfile>,
): Promise<void> {
  if (!db) return  // Si no hay Firestore inicializado

  const ref = doc(db, 'profiles', uid)  // Referencia al documento
  
  await updateDoc(ref, {
    ...profileData,        // Todos los campos nuevos
    updatedAt: serverTimestamp(),  // Timestamp automático de Firebase
  })
  
  // ✅ Los datos se guardan automáticamente en Firestore
}
```

---

## 5️⃣ CÓMO VERIFICAR QUE LOS DATOS SE GUARDAN

### Opción 1: Firebase Console

1. Ve a Firebase Console → Firestore Database
2. Selecciona la colección (ej: `profiles`)
3. Deberías ver documentos con ID = UID del usuario
4. Click en un documento para ver sus campos

### Opción 2: En el navegador (DevTools)

```javascript
// En la consola del navegador
import { getFirestore, collection, getDocs } from 'firebase/firestore'
const profiles = await getDocs(collection(db, 'profiles'))
profiles.forEach(doc => console.log(doc.id, doc.data()))
```

---

## 6️⃣ REGLAS DE SEGURIDAD (firestore.rules)

Las reglas ya están en `firestore.rules` y controlan **quién puede ver/editar qué**:

```
users/{uid}
├── Cualquiera puede leer su propio usuario
├── Solo admins pueden escribir
└── El usuario puede crear su propio documento

profiles/{uid}
├── Cualquiera puede leer su perfil
├── El campista solo puede editar el suyo
└── Líderes y admins pueden leer todos

retos/{retoId}
├── Todos pueden leer retos
├── Solo admins pueden crear/editar
└── Las publicaciones solo el autor puede editar
```

---

## 7️⃣ DATOS MODIFICADOS Y AUDITORIA

Cada vez que cambias datos, se registra:

```typescript
// En logsActividad/{logId}
{
  uid: "campista123",
  tipo: "RETO_PUBLICADO",  // O PERFIL_ACTUALIZADO, RETO_VALIDADO, etc.
  datos: {
    retoId: "reto_1",
    publicacionId: "pub_123"
  },
  createdAt: "2026-08-13T14:32:10Z"
}
```

Esto te permite auditar cambios e identificar problemas.

---

## 8️⃣ SINCRONIZACIÓN EN TIEMPO REAL

Los servicios usan listeners en tiempo real (no son solo "read once"):

```typescript
// Esto crea un listener que se actualiza automáticamente
onSnapshot(doc(db, 'profiles', uid), (snap) => {
  const datos = snap.data()
  // React se actualiza automáticamente
})
```

---

## 9️⃣ PASOS PARA GARANTIZAR PERSISTENCIA

✅ **Paso 1: Crear .env.local**
```bash
cp .env.local.example .env.local
# Editar con credenciales reales
```

✅ **Paso 2: Compilar**
```bash
npm run build
```

✅ **Paso 3: Deploy**
```bash
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

✅ **Paso 4: Verificar**
1. Abre app en vivo
2. Registrate
3. Completa perfil
4. Publica reto
5. Verifica en Firebase Console que los datos están

---

## 🔟 FÓRMULA PARA NO PERDER DATOS

```
Datos en la app → Firebase SDK → Firestore
                                    ↓
                            Se guarda automáticamente
                                    ↓
                            Disponible en tiempo real
                                    ↓
                            Backup automático de Google Cloud
```

**¡No necesitas hacer "guardar" manualmente - Firebase lo hace por ti!**

---

## 📱 PARA EL CAMPAMENTO DEL 28 DE AGOSTO

**Día antes:**
- [ ] Hacer deploy final
- [ ] Verificar que Firestore está subiendo datos
- [ ] Hacer backup manual

**Día del campamento:**
- [ ] Todos los campistas se registran
- [ ] Todos completan perfil → Se guardan en Firestore
- [ ] Publican retos → Nuevos documentos aparecen
- [ ] Líderes validan → XP se incrementa en tiempo real
- [ ] Leaderboard se actualiza automáticamente

**¡Todo persistido y seguro en Google Cloud!**
