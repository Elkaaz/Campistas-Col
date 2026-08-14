/**
 * SEED: Cargar 6 niveles al Firestore (usando Firebase Client SDK)
 * Uso: node seeders/seed-levels-client.mjs
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAV_k-qLCr8h4Q6bQqDe-qLCr8h4Q6bQqD',
  authDomain: 'campistas-col.firebaseapp.com',
  projectId: 'campistas-col',
  storageBucket: 'campistas-col.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123def456',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de los 6 niveles
const LEVELS_DATA = {
  semilla: {
    orden: 1,
    nombre: 'Semilla',
    descripcion: 'Aspirante nuevo, comienza tu aventura campista',
    color: '#8B7355',
    colorSecundario: '#D2B48C',
    icono: '🌱',
    xpRequerida: 0,
    xpParaSiguiente: 500,
  },
  raiz: {
    orden: 2,
    nombre: 'Raíz',
    descripcion: 'Consolidando base de habilidades campistas',
    color: '#654321',
    colorSecundario: '#A0693D',
    icono: '🌿',
    xpRequerida: 500,
    xpParaSiguiente: 1500,
  },
  tallo: {
    orden: 3,
    nombre: 'Tallo',
    descripcion: 'Creciendo en experiencia y liderazgo',
    color: '#228B22',
    colorSecundario: '#32CD32',
    icono: '🌾',
    xpRequerida: 1500,
    xpParaSiguiente: 3500,
  },
  hoja: {
    orden: 4,
    nombre: 'Hoja',
    descripcion: 'Dominando técnicas avanzadas',
    color: '#2E8B57',
    colorSecundario: '#3CB371',
    icono: '🍃',
    xpRequerida: 3500,
    xpParaSiguiente: 7500,
  },
  flor: {
    orden: 5,
    nombre: 'Flor',
    descripcion: 'Lider experimentado y mentor',
    color: '#FF1493',
    colorSecundario: '#FF69B4',
    icono: '🌸',
    xpRequerida: 7500,
    xpParaSiguiente: 15000,
  },
  fruto: {
    orden: 6,
    nombre: 'Fruto',
    descripcion: 'Máximo nivel - Autoridad campista',
    color: '#FF4500',
    colorSecundario: '#FFD700',
    icono: '🍎',
    xpRequerida: 15000,
    xpParaSiguiente: 999999,
  },
}

async function seedLevels() {
  console.log('🌱 Iniciando seed de niveles...\n')

  try {
    const levelsCollection = collection(db, 'levels')

    for (const [levelId, levelData] of Object.entries(LEVELS_DATA)) {
      await setDoc(doc(levelsCollection, levelId), levelData)
      console.log(`✅ Nivel '${levelData.nombre}' creado`)
    }

    console.log('\n✅ Seed de niveles completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante seed:', error.message)
    process.exit(1)
  }
}

seedLevels()
