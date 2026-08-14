# 🚀 GUÍA DE DEPLOY Y CONFIGURACIÓN DE FIREBASE

## 1️⃣ ESTRUCTURA DE DATOS EN FIRESTORE

### Colecciones principales:

```
Firestore
├── users/{uid}
│   ├── uid: string
│   ├── email: string
│   ├── role: 'campista' | 'lider_bosque' | 'comite_departamental' | 'admin'
│   └── createdAt: timestamp
│
├── profiles/{uid}
│   ├── uid: string
│   ├── displayName: string
│   ├── email: string
│   ├── role: string
│   ├── departamento: string
│   ├── municipio: string
│   ├── xpTotal: number
│   ├── nivelActual: string
│   ├── tipoSangre: string
│   ├── eps: string
│   ├── alergias: string
│   ├── contactoEmergencia: {
│   │   ├── nombre: string
│   │   ├── telefono: string
│   │   └── parentesco: string
│   ├── bio: string
│   ├── perfilCompleto: boolean
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── levels/{levelId}
│   ├── id: string
│   ├── name: string
│   ├── minXp: number
│   └── color: string
│
├── retos/{retoId}
│   ├── id: string
│   ├── titulo: string
│   ├── descripcion: string
│   ├── xpRecompensa: number
│   ├── categoria: string
│   ├── dificultad: 'facil' | 'medio' | 'dificil'
│   ├── requiereValidacion: boolean
│   └── createdAt: timestamp
│   └── publicaciones/{pubId}
│       ├── uid: string
│       ├── evidencia: string
│       ├── estado: 'pendiente' | 'validado' | 'rechazado'
│       └── createdAt: timestamp
│
├── cartillas/{cartillaId}
│   ├── titulo: string
│   ├── descripcion: string
│   └── progreso/{uid}
│       ├── completado: boolean
│       ├── progreso: number (0-100)
│       └── fueCompletadoEn: timestamp
│
└── validaciones/{validacionId}
    ├── publicacionId: string
    ├── uid: string
    ├── validadorUid: string
    ├── aprobado: boolean
    ├── xpAsignado: number
    └── createdAt: timestamp
```

---

## 2️⃣ INSTALACIÓN DE FIREBASE CLI

```bash
# En la carpeta del proyecto campistas-firebase

# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verificar instalación
firebase --version
```

---

## 3️⃣ INICIALIZAR PROYECTO EN FIREBASE

```bash
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"

# Login en Firebase (abre navegador para autenticarse)
firebase login

# Inicializar Firebase en el proyecto
firebase init

# Opciones a seleccionar:
# ✓ Firestore
# ✓ Hosting
# ✓ Functions (opcional, para lógica backend)
# 
# Preguntas:
# - Project: Selecciona "Campistas-Col"
# - Firestore Rules: dist/firestore.rules (o usa la que existe)
# - Hosting public directory: dist
# - Configure as SPA: Yes
# - GitHub CI: No (por ahora)
```

---

## 4️⃣ CONFIGURAR firebase.json

El archivo `firebase.json` debe verse así:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

---

## 5️⃣ PREPARAR PARA DEPLOY

```bash
# Compilar la app
npm run build

# Verificar que la carpeta dist/ existe y tiene archivos
ls dist/

# Resultado esperado:
# assets/
# index.html
```

---

## 6️⃣ DEPLOY COMPLETO

```bash
# Hacer deploy de todo (Firestore Rules + Hosting)
firebase deploy

# O deploy selectivo:
firebase deploy --only firestore:rules
firebase deploy --only hosting
firebase deploy --only functions  # si tienes functions
```

**La URL de tu app será:**
```
https://campistas-col.firebaseapp.com
```

---

## 7️⃣ VARIABLES DE ENTORNO

Crear archivo `.env.local` en la raíz de `campistas-firebase/`:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=campistas-col.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campistas-col
VITE_FIREBASE_STORAGE_BUCKET=campistas-col.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

Obtener estos valores en:
Firebase Console → Configuración del proyecto → Tus apps → Campistas Web → Configuración

---

## 8️⃣ INICIALIZAR DATOS DE PRUEBA

Una vez desplegado, ve a Firebase Console → Firestore y crea manualmente:

### Niveles (Collection: levels)

| id | name | minXp | color |
|---|---|---|---|
| aspirante | Aspirante | 0 | #9ca3af |
| semilla | Semilla | 100 | #84cc16 |
| raiz | Raíz | 300 | #8b5e3c |
| tallo | Tallo | 600 | #22c55e |
| hoja | Hoja | 1000 | #84cc16 |
| flor | Flor | 1500 | #f59e0b |
| fruto | Fruto | 2500 | #ef4444 |

### Retos (Collection: retos)

Crear al menos 3 retos de prueba:

```
{
  "titulo": "Fogata segura",
  "descripcion": "Presenta evidencia del armado y cuidado correcto de una fogata",
  "xpRecompensa": 80,
  "categoria": "habilidades-campismo",
  "dificultad": "medio",
  "requiereValidacion": true,
  "createdAt": serverTimestamp()
}

{
  "titulo": "Nudo de seguridad",
  "descripcion": "Demuestra el nudo solicitado sin errores",
  "xpRecompensa": 60,
  "categoria": "nudos",
  "dificultad": "facil",
  "requiereValidacion": true,
  "createdAt": serverTimestamp()
}

{
  "titulo": "Cartilla de convivencia",
  "descripcion": "Completa la cartilla sobre reglas de convivencia",
  "xpRecompensa": 50,
  "categoria": "educativo",
  "dificultad": "facil",
  "requiereValidacion": false,
  "createdAt": serverTimestamp()
}
```

---

## 9️⃣ FLUJO DE DATOS GUARDADOS

### Cuando un campista se registra:
1. Firebase Auth crea usuario con email/password
2. Cloud Function (o app) crea documento en `users/{uid}`
3. Cloud Function (o app) crea documento en `profiles/{uid}` con datos básicos

### Cuando completa perfil:
1. App actualiza `profiles/{uid}` con datos médicos y personales
2. Se marca `perfilCompleto: true`

### Cuando publica reto:
1. App crea documento en `retos/{retoId}/publicaciones/{pubId}`
2. Status inicia como `pendiente`
3. Se registra actividad en `logsActividad`

### Cuando líder valida:
1. Líder aprueba/rechaza en panel admin
2. Documento en `publicaciones` cambia estado
3. Si aprobado: se incrementa `profiles/{uid}/xpTotal` (con Cloud Function)
4. Se crea documento en `validaciones` con constancia

---

## 🔟 CLOUD FUNCTIONS (BACKEND LÓGICO)

Crear archivo `functions/index.js` para:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Cuando se valida un reto, asignar XP automáticamente
exports.asignarXpAlValidar = functions.firestore
  .document('validaciones/{validacionId}')
  .onCreate(async (snap, context) => {
    const validacion = snap.data();
    
    if (validacion.aprobado) {
      const profileRef = db.collection('profiles').doc(validacion.uid);
      await profileRef.update({
        xpTotal: admin.firestore.FieldValue.increment(validacion.xpAsignado)
      });
    }
  });

// Sincronizar leaderboard cada hora
exports.syncLeaderboard = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const profiles = await db.collection('profiles')
    .where('perfilCompleto', '==', true)
    .orderBy('xpTotal', 'desc')
    .limit(100)
    .get();

  const batch = db.batch();
  profiles.docs.forEach((doc, index) => {
    const leaderboardRef = db.collection('leaderboard').doc(`rank_${index + 1}`);
    batch.set(leaderboardRef, {
      rank: index + 1,
      uid: doc.data().uid,
      nombre: doc.data().displayName,
      xp: doc.data().xpTotal,
      nivel: doc.data().nivelActual,
      departamento: doc.data().departamento,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  return batch.commit();
});
```

---

## 📋 CHECKLIST DE DEPLOY

- [ ] `firebase login` - Autenticado en Firebase
- [ ] `firebase init` - Proyecto inicializado localmente
- [ ] `.env.local` - Variables de entorno configuradas
- [ ] `npm run build` - Build exitoso en `dist/`
- [ ] `firestore.rules` - Reglas de seguridad listas
- [ ] Datos de prueba creados manualmente en Firebase
- [ ] `firebase deploy` - Deployment exitoso
- [ ] Test: Registrarse en la app en vivo
- [ ] Test: Completar perfil y guardar
- [ ] Test: Publicar un reto y validar
- [ ] Test: Ver cambios en Firestore Console

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DEL DEPLOY

1. **Cloud Functions** para automatizar XP y leaderboard
2. **Email de confirmación** para registro
3. **Notificaciones** cuando reto es validado
4. **Backup automático** de datos
5. **Monitoreo y analytics** en Firebase Console
6. **Dominio personalizado** (campistas.org.co, etc.)

---

## 📞 TROUBLESHOOTING

**Error: "Firebase CLI not found"**
```bash
npm install -g firebase-tools
firebase --version
```

**Error: "No se puede conectar a Firestore"**
- Verificar variables de entorno en `.env.local`
- Verificar que la app está en Firebase Console
- Verificar que las reglas de seguridad permiten lectura

**Error al deploy: "Rules have errors"**
- Ir a Firebase Console → Firestore → Rules
- Verificar sintaxis en `firestore.rules`
- Deploy solo las reglas: `firebase deploy --only firestore:rules`

---

**¡Listo! El campamento del 28 de agosto tendrá su plataforma en vivo! 🎉**
