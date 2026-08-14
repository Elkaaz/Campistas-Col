const fs = require('fs');
const path = require('path');
const https = require('https');

// Leer el service account para obtener credenciales
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const projectId = serviceAccount.project_id;

const LEVELS = [
  { id: 'aspirante', name: 'Aspirante', minXp: 0, color: '#9ca3af' },
  { id: 'semilla', name: 'Semilla', minXp: 100, color: '#84cc16' },
  { id: 'raiz', name: 'Raíz', minXp: 300, color: '#8b5e3c' },
  { id: 'tallo', name: 'Tallo', minXp: 600, color: '#22c55e' },
  { id: 'hoja', name: 'Hoja', minXp: 1000, color: '#84cc16' },
  { id: 'flor', name: 'Flor', minXp: 1500, color: '#f59e0b' },
  { id: 'fruto', name: 'Fruto', minXp: 2500, color: '#ef4444' },
];

console.log('📝 Niveles a sembrar:');
LEVELS.forEach(l => console.log(`   - ${l.name} (${l.minXp} XP)`));

console.log('\n💡 Para completar el seed de LEVELS, sigue estos pasos manuales en Firebase Console:');
console.log('\n1. Ve a: https://console.firebase.google.com/project/campistas-col/firestore');
console.log('2. Crea una colección llamada "levels"');
console.log('3. Agrega estos 7 documentos:\n');

LEVELS.forEach((level, index) => {
  console.log(`\n--- Documento ${index + 1}: ID="${level.id}" ---`);
  console.log(JSON.stringify(level, null, 2));
});

console.log('\n\n✅ O ejecuta esto en el navegador (en la consola de Firestore):');
console.log('Haz clic en: "Iniciar colección" → escribe "levels"');
console.log('Luego agrega cada documento con el ID y campos mostrados arriba.');
