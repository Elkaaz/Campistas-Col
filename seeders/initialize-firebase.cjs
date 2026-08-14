/**
 * Script para inicializar Firestore con colecciones básicas
 * Uso: node seeders/initialize-firebase.cjs
 */

const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

// Cargar credenciales
const credentialsPath = path.resolve(process.cwd(), '../serviceAccountKey.json')

if (!fs.existsSync(credentialsPath)) {
  console.error('❌ No encontré serviceAccountKey.json')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function initializeFirebase() {
  console.log('🚀 Inicializando Firestore...\n')

  try {
    // 1. Crear colección profiles con un documento de prueba
    console.log('📝 Creando colección profiles...')
    await db.collection('profiles').doc('user_demo').set({
      uid: 'user_demo',
      displayName: 'Usuario Demo',
      email: 'demo@campistas.com',
      xpTotal: 250,
      nivelActual: 'semilla',
      nivelOrden: 1,
      departamento: 'Cundinamarca',
      municipio: 'Bogotá',
      rol: 'campista',
      activo: true,
      perfilCompleto: false,
      cartillasCompletadas: 0,
      quizzesCompletados: 0,
      retosPublicados: 0,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    })
    console.log('✅ Colección profiles creada con documento demo\n')

    // 2. Crear colección posts (vacía por ahora, se llena con publicaciones)
    console.log('📝 Creando colección posts...')
    await db.collection('posts').doc('_metadata').set({
      total: 0,
      createdAt: admin.firestore.Timestamp.now(),
    })
    // Borrar el documento de metadata
    await db.collection('posts').doc('_metadata').delete()
    console.log('✅ Colección posts creada\n')

    // 3. Crear colección retos con desafíos básicos
    console.log('📝 Creando colección retos...')
    const retos = [
      {
        titulo: 'Nudo de Llave',
        descripcion: 'Realizar correctamente un nudo de llave',
        tipo: 'nudo',
        xpRecompensa: 100,
        estado: 'activo',
        createdAt: admin.firestore.Timestamp.now(),
      },
      {
        titulo: 'Fogata Segura',
        descripcion: 'Construir una fogata segura con técnica correcta',
        tipo: 'fogata',
        xpRecompensa: 150,
        estado: 'activo',
        createdAt: admin.firestore.Timestamp.now(),
      },
      {
        titulo: 'Refugio de Emergencia',
        descripcion: 'Construir un refugio con materiales naturales',
        tipo: 'refugio',
        xpRecompensa: 200,
        estado: 'activo',
        createdAt: admin.firestore.Timestamp.now(),
      },
      {
        titulo: 'RCP Básico',
        descripcion: 'Demostrar técnica de RCP en maniquí',
        tipo: 'primeros_auxilios',
        xpRecompensa: 250,
        estado: 'activo',
        createdAt: admin.firestore.Timestamp.now(),
      },
      {
        titulo: 'Huerta Comunitaria',
        descripcion: 'Participar en creación de huerta',
        tipo: 'huerta',
        xpRecompensa: 100,
        estado: 'activo',
        createdAt: admin.firestore.Timestamp.now(),
      },
    ]

    for (const reto of retos) {
      await db.collection('retos').add(reto)
    }
    console.log(`✅ Colección retos creada con ${retos.length} desafíos\n`)

    // 4. Crear colección interactions (vacía, se llena con fogatas/nudos)
    console.log('📝 Creando colección interactions...')
    await db.collection('interactions').doc('_metadata').set({
      total: 0,
      createdAt: admin.firestore.Timestamp.now(),
    })
    // Borrar metadata
    await db.collection('interactions').doc('_metadata').delete()
    console.log('✅ Colección interactions creada\n')

    // 5. Crear colección activities (log de actividades)
    console.log('📝 Creando colección activities...')
    await db.collection('activities').doc('_metadata').set({
      total: 0,
      createdAt: admin.firestore.Timestamp.now(),
    })
    // Borrar metadata
    await db.collection('activities').doc('_metadata').delete()
    console.log('✅ Colección activities creada\n')

    console.log('✅✅✅ FIRESTORE INICIALIZADO EXITOSAMENTE ✅✅✅\n')
    console.log('Colecciones creadas:')
    console.log('  1. profiles (con usuario demo)')
    console.log('  2. posts (vacía)')
    console.log('  3. retos (con 5 desafíos)')
    console.log('  4. interactions (vacía)')
    console.log('  5. activities (vacía)')
    console.log('\nLa app está lista para funcionar.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante inicialización:')
    console.error(error.message)
    console.error(error)
    process.exit(1)
  }
}

initializeFirebase()
