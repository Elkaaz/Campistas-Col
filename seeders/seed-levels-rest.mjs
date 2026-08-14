/**
 * SEED: Cargar 6 niveles al Firestore usando REST API
 * Uso: node seeders/seed-levels-rest.mjs
 * 
 * Nota: Requiere que tengas un token de acceso válido
 * Para desarrollo local, es más fácil crear manualmente los niveles en Firebase Console
 */

import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'

const PROJECT_ID = 'campistas-col'

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

  // Para test mode en Firebase, puedes crear directo con REST API
  // pero necesitas auth. Es mejor hacerlo en Firebase Console o con Admin SDK

  console.log('⚠️ Nota: Para usar este script se requiere autenticación.')
  console.log('')
  console.log('📝 ALTERNATIVA RECOMENDADA:')
  console.log('1. Ir a: https://console.firebase.google.com/project/campistas-col/firestore')
  console.log('2. Click: + Start collection')
  console.log('3. Collection ID: levels')
  console.log('4. Crear 6 documentos con los datos de LEVELS_DATA')
  console.log('')
  console.log('O usa Firebase CLI + Admin SDK:')
  console.log('  npm install -g firebase-tools')
  console.log('  firebase emulators:start')
  console.log('')
  process.exit(0)
}

seedLevels()
