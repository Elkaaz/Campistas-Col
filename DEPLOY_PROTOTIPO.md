# Desplegar el prototipo (GitHub → Firebase Hosting)

El prototipo funciona en dos modos, sin cambiar código:

| Modo | Cuándo se activa | Qué hace |
| --- | --- | --- |
| **Demo** | No hay variables `VITE_FIREBASE_*` | Muestra campistas, retos, feed y ranking de ejemplo. Reacciones y publicaciones se guardan en memoria (se reinician al recargar). |
| **Firebase** | Están las variables `VITE_FIREBASE_*` | Usa Auth + Firestore reales. |

## 1. Variables de entorno

Local: copia `.env.local.example` a `.env.local` y completa los valores de Firebase Console.

GitHub: añade estos *repository secrets* (Settings → Secrets and variables → Actions):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT        # JSON de la cuenta de servicio (deploy)
VITE_CLOUDINARY_CLOUD_NAME      # opcional
VITE_CLOUDINARY_UPLOAD_PRESET   # opcional
```

## 2. Workflow de despliegue

`.github/workflows/firebase-deploy.yml` compila **sin** las variables `VITE_FIREBASE_*`, por lo que
el bundle publicado nunca inicializa Firebase. Reemplaza los pasos de build por:

```yaml
      - name: Typecheck
        run: npm run typecheck

      - name: Build app
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
          VITE_CLOUDINARY_CLOUD_NAME: ${{ secrets.VITE_CLOUDINARY_CLOUD_NAME }}
          VITE_CLOUDINARY_UPLOAD_PRESET: ${{ secrets.VITE_CLOUDINARY_UPLOAD_PRESET }}
```

> Este cambio no pudo incluirse en el PR: GitHub bloquea que una app OAuth modifique
> archivos de `.github/workflows`. Hay que aplicarlo manualmente o con un token con scope `workflow`.

## 3. Reglas e índices de Firestore

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Las reglas ya cubren las colecciones que usa el código (`posts`, `interactions`,
`retos/{retoId}/publicaciones` y la consulta *collection group* del panel de validación).

## 4. Cloudinary (imágenes)

`src/services/imageService.ts` sube las evidencias a Cloudinary con un *upload preset* sin firmar
cuando `VITE_CLOUDINARY_CLOUD_NAME` y `VITE_CLOUDINARY_UPLOAD_PRESET` existen; si no, convierte el
archivo a data URL para que el prototipo funcione sin backend.
