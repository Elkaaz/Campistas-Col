/**
 * SEED: Cargar 8 cartillas de ejemplo al Firestore
 * Uso: node seeders/seed-cartillas.mjs
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

// 8 cartillas de ejemplo
const CARTILLAS_DATA = [
  {
    nombre: 'Técnicas de Fogata',
    slug: 'tecnicas-fogata',
    descripcion:
      'Aprende las técnicas fundamentales para construir y mantener fogatas seguras',
    nivel: 'Tallo',
    categoria: 'Técnicas Campamentiles',
    icono: '🔥',
    colorTema: '#FF4500',
    contenido:
      '<h2>Técnicas de Fogata Segura</h2><p>Una fogata es el corazón del campamento...</p>',
    orden: 1,
    seccion: 'Habilidades Técnicas',
    competidosTotal: 245,
  },
  {
    nombre: 'Nudos Campamentiles Esenciales',
    slug: 'nudos-esenciales',
    descripcion: 'Domina los nudos más utilizados en campamentos y actividades outdoor',
    nivel: 'Raíz',
    categoria: 'Técnicas Campamentiles',
    icono: '🪢',
    colorTema: '#8B4513',
    contenido: '<h2>Nudos Esenciales</h2><p>Los nudos son fundamentales...</p>',
    orden: 2,
    seccion: 'Habilidades Técnicas',
    competidosTotal: 312,
  },
  {
    nombre: 'Construcción de Refugios',
    slug: 'construccion-refugios',
    descripcion: 'Aprende a construir refugios seguros con materiales naturales',
    nivel: 'Tallo',
    categoria: 'Técnicas Campamentiles',
    icono: '⛺',
    colorTema: '#228B22',
    contenido: '<h2>Refugios Campamentiles</h2><p>El refugio es tu hogar...</p>',
    orden: 3,
    seccion: 'Habilidades Técnicas',
    competidosTotal: 189,
  },
  {
    nombre: 'Primeros Auxilios Básicos',
    slug: 'primeros-auxilios',
    descripcion: 'Conoce los procedimientos básicos de primeros auxilios en campo',
    nivel: 'Raíz',
    categoria: 'Prevención y Salud',
    icono: '🏥',
    colorTema: '#DC143C',
    contenido: '<h2>Primeros Auxilios</h2><p>Saber actuar en emergencias es vital...</p>',
    orden: 4,
    seccion: 'Bienestar y Salud',
    competidosTotal: 421,
  },
  {
    nombre: 'Conciencia Ambiental Campista',
    slug: 'conciencia-ambiental',
    descripcion: 'Comprometerse con la sostenibilidad y el cuidado del medio ambiente',
    nivel: 'Hoja',
    categoria: 'Conciencia Ambiental',
    icono: '🌍',
    colorTema: '#2E8B57',
    contenido:
      '<h2>Conciencia Ambiental</h2><p>Los campistas somos guardianes de la naturaleza...</p>',
    orden: 5,
    seccion: 'Conciencia Ambiental',
    competidosTotal: 267,
  },
  {
    nombre: 'Liderazgo y Trabajo en Equipo',
    slug: 'liderazgo-equipo',
    descripcion: 'Desarrolla habilidades de liderazgo y colaboración',
    nivel: 'Hoja',
    categoria: 'Formación y Crecimiento Personal',
    icono: '👥',
    colorTema: '#4169E1',
    contenido:
      '<h2>Liderazgo Campista</h2><p>Todo campista debe desarrollar capacidades de líder...</p>',
    orden: 6,
    seccion: 'Liderazgo',
    competidosTotal: 198,
  },
  {
    nombre: 'Orientación y Navegación',
    slug: 'orientacion-navegacion',
    descripcion: 'Aprende a usar brújula, mapa y GPS para orientarte en la naturaleza',
    nivel: 'Tallo',
    categoria: 'Técnicas Campamentiles',
    icono: '🧭',
    colorTema: '#FF6347',
    contenido:
      '<h2>Orientación Campista</h2><p>Saber dónde estás es fundamental para la seguridad...</p>',
    orden: 7,
    seccion: 'Habilidades Técnicas',
    competidosTotal: 156,
  },
  {
    nombre: 'Cocina de Campo Segura',
    slug: 'cocina-campo',
    descripcion: 'Técnicas seguras para preparar alimentos en el campamento',
    nivel: 'Raíz',
    categoria: 'Técnicas Campamentiles',
    icono: '🍳',
    colorTema: '#FF8C00',
    contenido:
      '<h2>Cocina de Campo</h2><p>Alimentarse bien en campamento es importante...</p>',
    orden: 8,
    seccion: 'Habilidades Técnicas',
    competidosTotal: 334,
  },
]

async function seedCartillas() {
  console.log('📚 Iniciando seed de cartillas...\n')

  try {
    for (const cartillaData of CARTILLAS_DATA) {
      const docRef = await db.collection('cartillas').add({
        ...cartillaData,
        archivoPdf: `https://firebasestorage.googleapis.com/placeholder/${cartillaData.slug}.pdf`,
        imagenPortada: `https://firebasestorage.googleapis.com/placeholder/${cartillaData.slug}.jpg`,
        creadoPor: 'admin_system',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Cartilla '${cartillaData.nombre}' creada (ID: ${docRef.id})`)
    }

    console.log('\n✅ Seed de cartillas completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante seed:', error)
    process.exit(1)
  }
}

seedCartillas()
