
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

async function configureCors() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.replace('.firebasestorage.app', '.appspot.com');
  console.log(`Configuring CORS for bucket: ${bucketName}`);
  
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  
  try {
    await bucket.setCorsConfiguration([
      {
        origin: ['*'], // Or specifically ['http://localhost:3000']
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-resumable'],
        maxAgeSeconds: 3600
      }
    ]);
    console.log('✅ CORS configuration successfully set on bucket!');
  } catch (error) {
    console.error('❌ Failed to set CORS:', error);
  }
}

configureCors();
