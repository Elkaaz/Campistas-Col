# 🚀 PASOS INMEDIATOS - DEPLOY EN 15 MINUTOS

## Paso 1: Instalar Firebase CLI

En la terminal PowerShell:

```powershell
npm install -g firebase-tools
firebase --version  # Debe mostrarte una versión
```

---

## Paso 2: Autenticarse en Firebase

```powershell
firebase login
# Abre navegador y autoriza
# Selecciona tu cuenta Google
```

---

## Paso 3: Crear archivo firebase.json

En la raíz del proyecto `campistas-firebase/`, crea el archivo `firebase.json`:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Paso 4: Configurar Variables de Entorno

En la carpeta `campistas-firebase/`, crea `.env.local`:

```env
VITE_FIREBASE_API_KEY=<AQUÍ VA TU API KEY>
VITE_FIREBASE_AUTH_DOMAIN=campistas-col.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campistas-col
VITE_FIREBASE_STORAGE_BUCKET=campistas-col.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<TU SENDER ID>
VITE_FIREBASE_APP_ID=<TU APP ID>
VITE_FIREBASE_MEASUREMENT_ID=<TU MEASUREMENT ID>
```

### Dónde obtener estos valores:

1. Ve a Firebase Console (ya abierto en tu navegador)
2. Selecciona proyecto "Campistas-Col"
3. Click en ⚙️ (Configuración) → Configuración del proyecto
4. Tab "Tus apps" → Busca la app "Web"
5. Copia los valores de `firebaseConfig`

---

## Paso 5: Compilar la App

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"
npm run build
```

Verifica que se creo la carpeta `dist/` con archivos.

---

## Paso 6: Hacer Deploy

```powershell
# Deploy de firestore rules
firebase deploy --only firestore:rules

# Deploy de hosting
firebase deploy --only hosting

# O todo junto:
firebase deploy
```

**¡Tu app estará en vivo en:**
```
https://campistas-col.firebaseapp.com
```

---

## Paso 7: Crear Datos de Prueba en Firestore

### En Firebase Console:

1. Ve a **Firestore Database**
2. Click en **+ Start Collection**

### Crear colección: `levels`

Document ID: `aspirante`
```json
{
  "id": "aspirante",
  "name": "Aspirante",
  "minXp": 0,
  "color": "#9ca3af"
}
```

**Repetir para:** semilla, raiz, tallo, hoja, flor, fruto

### Crear colección: `retos`

Document ID: `reto_1`
```json
{
  "titulo": "Fogata segura",
  "descripcion": "Presenta evidencia del armado y cuidado de una fogata",
  "xpRecompensa": 80,
  "categoria": "campismo",
  "dificultad": "medio",
  "requiereValidacion": true,
  "createdAt": "2026-08-13T10:00:00Z"
}
```

---

## Paso 8: Probar la App

1. Abre: `https://campistas-col.firebaseapp.com`
2. Registrate con un email de prueba
3. Completa tu perfil
4. Publica un reto
5. Vuelve a la consola de Firebase → Firestore
6. Deberías ver los documentos creados

---

## ✅ CHECKLIST

- [ ] `firebase login` completado
- [ ] `firebase.json` creado
- [ ] `.env.local` con valores reales
- [ ] `npm run build` exitoso
- [ ] `firebase deploy` completado
- [ ] App accesible en Firebase Hosting
- [ ] Datos de prueba creados
- [ ] Registro y perfil funcionan en vivo

---

## 📍 PARA EL 28 DE AGOSTO

**Antes del campamento:**
- [ ] Cargar todos los retos reales
- [ ] Crear roles (admin, líderes, etc.)
- [ ] Pruebas con datos reales
- [ ] Backup de Firestore
- [ ] Capacitar a líderes en validación

**Durante el campamento:**
- [ ] Sincronizar en vivo leaderboard
- [ ] Monitorear Firestore Console para problemas
- [ ] Ayuda con registro de campistas

---

## 🆘 SOPORTE

Cualquier error:
1. Revisar Firebase Console → Logs
2. Ejecutar: `firebase serve` (para testing local)
3. Verificar reglas de Firestore
4. Asegurar `.env.local` con valores correctos

