/**
 * SEED MAESTRO: Ejecuta todos los seeders en orden
 * Uso: node seeders/seed-all.mjs
 */

import { spawn } from 'child_process'
import * as path from 'path'

const seeders = [
  'seed-levels.mjs',
  'seed-retos.mjs',
  'seed-cartillas.mjs',
  'seed-municipios.mjs',
]

let currentIndex = 0

function runSeeder(name) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`▶️  Ejecutando: ${name}`)
    console.log('='.repeat(60))

    const seederPath = path.resolve(process.cwd(), 'seeders', name)
    const child = spawn('node', [seederPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
    })

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} completado\n`)
        resolve()
      } else {
        console.error(`❌ ${name} falló con código ${code}\n`)
        reject(new Error(`Seeder ${name} failed`))
      }
    })

    child.on('error', reject)
  })
}

async function runAllSeeders() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         🌱 SEED MAESTRO - RED SOCIAL GAMIFICADA           ║
║             Cargando datos iniciales...                    ║
╚═══════════════════════════════════════════════════════════╝
  `)

  try {
    for (const seeder of seeders) {
      await runSeeder(seeder)
    }

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  ✅ ¡TODOS LOS SEEDERS COMPLETADOS EXITOSAMENTE!          ║
║                                                             ║
║  Firestore ahora contiene:                                 ║
║  • 6 Niveles (Semilla → Fruto)                            ║
║  • 5 Retos base                                            ║
║  • 8 Cartillas de formación                               ║
║  • 3 Municipios colombianos                               ║
║                                                             ║
║  Siguiente: Conectar servicios a las páginas              ║
╚═══════════════════════════════════════════════════════════╝
    `)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error en seed maestro:', error.message)
    process.exit(1)
  }
}

runAllSeeders()
