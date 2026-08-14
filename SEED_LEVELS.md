# 🌱 Seed LEVELS Collection

Para popular la colección `levels` en Firestore, sigue estos pasos:

## Opción 1: Usando el script Node.js (Recomendado)

### Paso 1: Descargar Service Account Key
1. Ve a [Firebase Console](https://console.firebase.google.com) → Campistas-Col
2. Haz clic en ⚙️ Configuración → **Service Accounts**
3. Haz clic en **"Generar nueva clave privada"**
4. Se descargará un archivo JSON
5. Copia ese archivo a la raíz del proyecto y renómbralo como `serviceAccountKey.json`

### Paso 2: Instalar dependencias (si no lo has hecho)
```bash
npm install firebase-admin
```

### Paso 3: Ejecutar el script
```bash
node seed-levels.js
```

Deberías ver:
```
🌱 Starting LEVELS seed...
✅ Seeded level: Aspirante
✅ Seeded level: Semilla
✅ Seeded level: Raíz
✅ Seeded level: Tallo
✅ Seeded level: Hoja
✅ Seeded level: Flor
✅ Seeded level: Fruto
🎉 All levels seeded successfully!
```

## Opción 2: Desde Firestore Console (Manual)

1. Ve a [Firebase Console](https://console.firebase.google.com) → Campistas-Col → Firestore
2. Crea una colección llamada `levels`
3. Agrega estos documentos con ID igual al campo `id`:

| ID | name | minXp | color |
|---|---|---|---|
| aspirante | Aspirante | 0 | #9ca3af |
| semilla | Semilla | 100 | #84cc16 |
| raiz | Raíz | 300 | #8b5e3c |
| tallo | Tallo | 600 | #22c55e |
| hoja | Hoja | 1000 | #84cc16 |
| flor | Flor | 1500 | #f59e0b |
| fruto | Fruto | 2500 | #ef4444 |

## ✅ Verificar que funcionó
- Ve a Firestore Console → `levels` collection
- Deberías ver 7 documentos

---

**Nota:** El archivo `serviceAccountKey.json` contiene credenciales sensibles. NO lo commits a Git. Está en `.gitignore` por defecto.
