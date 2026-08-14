# 🌱 SEEDERS - Datos Iniciales Firestore

Scripts para cargar datos iniciales en Firestore de forma automática.

## 📋 PREREQUISITOS

1. **Proyecto Firebase creado**: https://console.firebase.google.com
2. **Firestore habilitado**: En Firebase Console → Firestore → Create Database
3. **serviceAccountKey.json descargado**:
   - Firebase Console → Configuración del proyecto → Cuentas de servicio
   - Descargar clave privada JSON
   - Guardar en raíz del proyecto: `serviceAccountKey.json`

## 🚀 USO

### Opción 1: Ejecutar todos los seeders (RECOMENDADO)

```bash
cd seeders
node seed-all.mjs
```

Esto ejecutará en orden:
1. `seed-levels.mjs` - Carga 6 niveles
2. `seed-retos.mjs` - Carga 5 retos
3. `seed-cartillas.mjs` - Carga 8 cartillas
4. `seed-municipios.mjs` - Carga 3 municipios

### Opción 2: Ejecutar seeders individuales

```bash
# Solo niveles
node seeders/seed-levels.mjs

# Solo retos
node seeders/seed-retos.mjs

# Solo cartillas
node seeders/seed-cartillas.mjs

# Solo municipios
node seeders/seed-municipios.mjs
```

## 📊 DATOS CARGADOS

### Niveles (6)
- 🌱 **Semilla** (0 XP)
- 🌿 **Raíz** (500 XP)
- 🌾 **Tallo** (1500 XP)
- 🍃 **Hoja** (3500 XP)
- 🌸 **Flor** (7500 XP)
- 🍎 **Fruto** (15000 XP)

### Retos (5)
- 🔥 Fogata Segura (80 XP)
- 🪢 Nudo Básico Perfecto (60 XP)
- ⛺ Refugio Emergencia (100 XP)
- 🌱 Huerta Sostenible (120 XP)
- 🏥 Primeros Auxilios (150 XP)

### Cartillas (8)
- Técnicas de Fogata
- Nudos Campamentiles
- Construcción de Refugios
- Primeros Auxilios Básicos
- Conciencia Ambiental
- Liderazgo y Trabajo en Equipo
- Orientación y Navegación
- Cocina de Campo

### Municipios (3)
- 🏘️ Medellín, Antioquia (47 campistas)
- 🏘️ Bogotá, Cundinamarca (92 campistas)
- 🏘️ Cartagena, Bolívar (28 campistas)

## ⚠️ NOTAS IMPORTANTES

- **Idempotente**: Ejecutar múltiples veces es seguro (sobrescribe)
- **Autenticación**: Requiere credenciales válidas de Firebase Admin SDK
- **Permisos**: Asegúrate que Firestore Rules permite escritura
- **Tiempo**: Primera ejecución puede tomar algunos segundos

## 🔧 ESTRUCTURA

```
seeders/
├── seed-levels.mjs       # Carga niveles
├── seed-retos.mjs        # Carga retos
├── seed-cartillas.mjs    # Carga cartillas
├── seed-municipios.mjs   # Carga municipios
├── seed-all.mjs          # Ejecuta todos
└── README.md             # Este archivo
```

## 🐛 TROUBLESHOOTING

### Error: "serviceAccountKey.json not found"
```
Solución: Descargar desde Firebase Console y guardar en raíz del proyecto
```

### Error: "Permission denied"
```
Solución: Revisar Firestore Rules en Firebase Console
Temporal: En desarrollo, permitir todas las escrituras
```

### Error: "App already initialized"
```
Solución: Cerrar otros procesos que usen Firebase Admin SDK
```

## 📝 SIGUIENTES PASOS

1. ✅ Ejecutar seeders
2. ⏳ Verificar en Firebase Console que se crearon colecciones
3. ⏳ Conectar servicios a páginas (HomePage, LeaderboardPage, etc.)
4. ⏳ Pruebas exhaustivas
5. ⏳ Deploy a producción

---

**Creado**: Agosto 2026
**Versión**: 1.0
**Estado**: Listo para usar
