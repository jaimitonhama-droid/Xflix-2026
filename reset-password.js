const { getApps, initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();

async function run() {
  const email = "keylancossa@gmail.com";
  try {
    const user = await auth.getUserByEmail(email);
    console.log(`User found: ${user.uid}. Updating password...`);
    
    await auth.updateUser(user.uid, {
      password: "password123"
    });
    
    console.log("Password successfully updated to: password123");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
