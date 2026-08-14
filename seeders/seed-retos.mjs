/**
 * SEED: Cargar 5 retos base al Firestore
 * Uso: node seeders/seed-retos.mjs
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

// 5 retos base
const RETOS_DATA = [
  {
    id: 'reto_1',
    titulo: 'Fogata Segura',
    descripcion: 'Construye y enciende una fogata segura siguiendo protocolos',
    tipo: 'fogata',
    nivelRecomendado: 'Tallo',
    xpRecompensa: 80,
    criteriosEvaluacion:
      'Debe demostrar: preparación segura, control del fuego, extinción correcta',
    icono: '🔥',
    colorTema: '#FF4500',
    estado: 'activo',
  },
  {
    id: 'reto_2',
    titulo: 'Nudo Básico Perfecto',
    descripcion: 'Domina los nudos fundamentales: cuadrado, ballestrinque, as de guía',
    tipo: 'nudo',
    nivelRecomendado: 'Raíz',
    xpRecompensa: 60,
    criteriosEvaluacion:
      'Ejecutar 3 nudos sin errores, explicar uso de cada uno',
    icono: '🪢',
    colorTema: '#8B4513',
    estado: 'activo',
  },
  {
    id: 'reto_3',
    titulo: 'Refugio Emergencia',
    descripcion: 'Construye un refugio de emergencia con materiales disponibles',
    tipo: 'refugio',
    nivelRecomendado: 'Tallo',
    xpRecompensa: 100,
    criteriosEvaluacion:
      'Refugio debe proteger del clima, construido en menos de 30 minutos',
    icono: '⛺',
    colorTema: '#228B22',
    estado: 'activo',
  },
  {
    id: 'reto_4',
    titulo: 'Huerta Sostenible',
    descripcion: 'Cultiva una mini huerta con técnicas de permacultura',
    tipo: 'huerta',
    nivelRecomendado: 'Hoja',
    xpRecompensa: 120,
    criteriosEvaluacion:
      'Mantener huerta por 30 días, documentar crecimiento, reportar cosecha',
    icono: '🌱',
    colorTema: '#2E8B57',
    estado: 'activo',
  },
  {
    id: 'reto_5',
    titulo: 'Primeros Auxilios Certificado',
    descripcion: 'Completa curso básico de primeros auxilios y demuestra habilidades',
    tipo: 'primeros_auxilios',
    nivelRecomendado: 'Raíz',
    xpRecompensa: 150,
    criteriosEvaluacion:
      'Pasar evaluación práctica: RCP, vendaje, shock, heridas',
    icono: '🏥',
    colorTema: '#DC143C',
    estado: 'activo',
  },
]

async function seedRetos() {
  console.log('🎯 Iniciando seed de retos...\n')

  try {
    for (const retoData of RETOS_DATA) {
      const { id, ...data } = retoData
      await db.collection('retos').doc(id).set({
        ...data,
        creadoPor: 'admin_system',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Reto '${data.titulo}' creado`)
    }

    console.log('\n✅ Seed de retos completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante seed:', error)
    process.exit(1)
  }
}

seedRetos()
