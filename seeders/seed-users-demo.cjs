/**
 * SEED: Usuarios Demo
 * Crea usuarios de prueba usando Admin SDK (con permisos totales)
 * Uso: node seeders/seed-users-demo.cjs
 */

const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

// Cargar serviceAccountKey
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json')
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json no encontrado. Usa: node seeders/seed-users-demo.cjs desde la raíz del proyecto')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campistas-col',
})

const db = admin.firestore()

const demoUsers = [
  {
    uid: 'demo-user-1',
    displayName: 'Carlos Campista',
    email: 'carlos@campistascol.com',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    departamento: 'Antioquia',
    municipio: 'Medellín',
    nivelActual: 'tallo',
    xpTotal: 450,
    role: 'campista',
    perfilCompleto: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uid: 'demo-user-2',
    displayName: 'María Aventura',
    email: 'maria@campistascol.com',
    firstName: 'María',
    lastName: 'Gómez',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá',
    nivelActual: 'hoja',
    xpTotal: 780,
    role: 'campista',
    perfilCompleto: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uid: 'demo-user-3',
    displayName: 'Juan Explorador',
    email: 'juan@campistascol.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    departamento: 'Bolívar',
    municipio: 'Cartagena',
    nivelActual: 'raiz',
    xpTotal: 280,
    role: 'campista',
    perfilCompleto: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uid: 'demo-user-4',
    displayName: 'Sofía Líder',
    email: 'sofia@campistascol.com',
    firstName: 'Sofía',
    lastName: 'López',
    departamento: 'Antioquia',
    municipio: 'Medellín',
    nivelActual: 'flor',
    xpTotal: 1200,
    role: 'lider_bosque',
    perfilCompleto: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

async function seedDemoUsers() {
  console.log('👥 Iniciando seed de usuarios demo...')

  try {
    for (const user of demoUsers) {
      const profileData = {
        ...user,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
        cartillasCompletadas: Math.floor(Math.random() * 3),
        quizzesCompletados: Math.floor(Math.random() * 5),
      }

      // Usar Admin SDK para escribir
      await db.collection('profiles').doc(user.uid).set(profileData)
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })

      console.log(`✅ Usuario '${user.displayName}' creado (${user.nivelActual})`)
    }

    console.log('✅ Seed de usuarios demo completado exitosamente\n')
  } catch (error) {
    console.error('❌ Error en seed de usuarios:', error.message)
    process.exit(1)
  }
}

seedDemoUsers().then(() => {
  console.log('🎉 ¡Listos! Ya hay usuarios demo en Firestore')
  process.exit(0)
})
