---
name: testing-prototipo-demo
description: How to run and test the Campistas Col React+Vite prototype locally in "modo demo" (no Firebase credentials), including routes, the demo user and known gotchas.
---

# Testing Campistas Col (modo demo)

## Arrancar
- `npm install` (solo la primera vez) y `npm run dev` → http://localhost:5173.
- **No crear `.env.local`**: sin `VITE_FIREBASE_*` la app entra en modo demo (`src/firebase.ts` → `demoMode`, `db === null`) y todos los servicios caen al store en memoria (`src/data/demoStore.ts`).
- En modo demo siempre hay sesión iniciada (`AuthContext`); `/auth` acepta cualquier correo/contraseña.

## Datos semilla útiles para aserciones
- Usuario actual: **Santiago Correa** (`demo_santiago`, 6100 XP, nivel Hoja, Medellín) — `src/data/demoData.ts`.
- 6 posts (`post_1`..`post_6`), 5 retos, 8 usuarios. `post_1` inicia con 🔥34 / 🪢12; el usuario actual no tiene interacciones previas, así que el primer click siempre **incrementa**.
- Publicar un reto suma XP al usuario (`demoStore.addXp`), verificable en `/leaderboard`.

## Gotcha importante
- El estado vive en memoria: **cualquier recarga completa (F5 o escribir la URL en la barra) resetea los datos**. Para probar persistencia entre pantallas navega solo con los enlaces del navbar / de la UI, nunca por la barra de direcciones.

## Rutas (src/App.tsx)
`/`, `/bosque`, `/retos`, `/retos/:id/publicar`, `/leaderboard`, `/leaderboard/local`, `/perfiles/:uid`, `/mi-perfil`, `/dashboard`, `/admin`, `/auth`, `/login`. Cualquier ruta desconocida cae en `Navigate to="/"`.

## Subir imágenes
Sin Cloudinary configurado, `src/services/imageService.ts` convierte el archivo a data URL, así que basta con un PNG local (p. ej. generar uno en `/tmp` con PIL) en el input de "Evidencia".

## Puntos visuales frágiles (revisar en cada cambio de CSS)
- `RetoCard`: el `h3`/descripción heredan `color: #fff` sobre tarjeta blanca → texto invisible en `/retos`.
- El formulario de `/retos/:id/publicar` puede quedar sin estilos (labels en línea, textarea superpuesto) si faltan reglas en `src/styles/pages.css`.
- Los labels del navbar se cortan a la primera palabra (`label.split(' ')[0]`), por lo que "Mi Bosque" y "Mi Perfil" aparecen ambos como "Mi".

## Devin Secrets Needed
Ninguno — el modo demo no requiere credenciales.
