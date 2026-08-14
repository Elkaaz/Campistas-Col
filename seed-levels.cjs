const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Service account file not found at ${serviceAccountPath}`);
  console.log('📝 To get a service account key:');
  console.log('1. Go to Firebase Console → Project Settings');
  console.log('2. Click "Service Accounts" tab');
  console.log('3. Click "Generate New Private Key"');
  console.log('4. Save it as "serviceAccountKey.json" in the project root');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

const LEVELS_SEED = [
  { id: 'aspirante', name: 'Aspirante', minXp: 0, color: '#9ca3af' },
  { id: 'semilla', name: 'Semilla', minXp: 100, color: '#84cc16' },
  { id: 'raiz', name: 'Raíz', minXp: 300, color: '#8b5e3c' },
  { id: 'tallo', name: 'Tallo', minXp: 600, color: '#22c55e' },
  { id: 'hoja', name: 'Hoja', minXp: 1000, color: '#84cc16' },
  { id: 'flor', name: 'Flor', minXp: 1500, color: '#f59e0b' },
  { id: 'fruto', name: 'Fruto', minXp: 2500, color: '#ef4444' },
];

async function seedLevels() {
  try {
    console.log('🌱 Starting LEVELS seed...');

    for (const level of LEVELS_SEED) {
      await db.collection('levels').doc(level.id).set(level);
      console.log(`✅ Seeded level: ${level.name}`);
    }

    console.log('🎉 All levels seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding levels:', error);
    process.exit(1);
  }
}

seedLevels();
