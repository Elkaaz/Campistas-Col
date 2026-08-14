# ⚡ PRIMEROS 3 PASOS - EMPEZAR AHORA

## PASO 1: Instalar Firebase CLI

Copia y pega en PowerShell (como administrador si pide):

```powershell
npm install -g firebase-tools
firebase --version
```

Espera a que termine. Deberías ver algo como: `13.0.2`

---

## PASO 2: Autenticarte en Firebase

```powershell
firebase login
```

Esto abre un navegador y te pide que selecciones tu cuenta Google. Elige la que tiene "Campistas-Col".

---

## PASO 3: Navega al proyecto y compila

```powershell
cd "c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase"
npm run build
```

Cuando termine, deberías ver:

```
✓ 65 modules transformed.
✓ built in 5.97s
```

---

## ✅ CUANDO HAYAS HECHO ESOS 3 PASOS

Avísame y te digo:

1. Cómo obtener las credenciales de Firebase Console
2. Cómo crear el archivo `.env.local`
3. Cómo hacer el deploy final con `firebase deploy`

---

## 📍 MIENTRAS TANTO

**Ten abierto en el navegador:**
- Firebase Console: https://console.firebase.google.com/
- Tu proyecto "Campistas-Col"

**Proyecto en tu PC:**
- Carpeta: `c:\Users\PROGAME\Desktop\Red Campista Col\Red Campista Col\campistas-firebase`

---

## 🎯 META

En 1 hora tu app estará en vivo en:

```
https://campistas-col.firebaseapp.com
```

Todos los campistas podrán registrarse y los datos se guardarán automáticamente en Firestore.

**¡Empecemos!** Ejecuta esos 3 comandos ahora.
