/**
 * SEED: Cargar municipios colombianos al Firestore
 * Uso: node seeders/seed-municipios.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as fs from 'fs'
import * as path from 'path'

const credentialsPath = path.resolve(
  process.cwd(),
  'serviceAccountKey.json'
)

if (!fs.existsSync(credentialsPath)) {
  console.error('❌ No encontré serviceAccountKey.json')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

// Municipios colombianos de ejemplo
const MUNICIPIOS_DATA = [
  {
    nombre: 'Medellín',
    departamento: 'Antioquia',
    bosqueNombre: 'Bosque del Río Magdalena',
    bosqueDescripcion:
      'Grupo activo de campistas de Medellín, corazón de Antioquia',
    campistasTotal: 47,
    lideresTotal: 5,
    coordenadas: {
      latitud: 6.2442,
      longitud: -75.5812,
    },
  },
  {
    nombre: 'Bogotá',
    departamento: 'Cundinamarca',
    bosqueNombre: 'Bosque de la Sabana',
    bosqueDescripcion:
      'Comunidad de campistas en la capital, actividades todo el año',
    campistasTotal: 92,
    lideresTotal: 8,
    coordenadas: {
      latitud: 4.7110,
      longitud: -74.0721,
    },
  },
  {
    nombre: 'Cartagena',
    departamento: 'Bolívar',
    bosqueNombre: 'Bosque Caribeño',
    bosqueDescripcion: 'Campistas del Caribe colombiano, aventuras costeras',
    campistasTotal: 28,
    lideresTotal: 3,
    coordenadas: {
      latitud: 10.3932,
      longitud: -75.5148,
    },
  },
]

async function seedMunicipios() {
  console.log('🏘️  Iniciando seed de municipios...\n')

  try {
    for (const municipioData of MUNICIPIOS_DATA) {
      const docRef = await db.collection('municipios').add({
        ...municipioData,
        createdAt: new Date(),
      })
      console.log(
        `✅ Municipio '${municipioData.nombre}' creado (ID: ${docRef.id})`
      )
    }

    console.log('\n✅ Seed de municipios completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante seed:', error)
    process.exit(1)
  }
}

seedMunicipios()
