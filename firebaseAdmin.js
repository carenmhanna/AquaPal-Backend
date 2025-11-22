import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Check if the env variable exists (Render)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./firebase-service-account.json"); // local fallback

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
