import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let isInitialized = false;

if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      const parsedServiceAccount = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(parsedServiceAccount),
      });
      isInitialized = true;
      console.log("✓ Firebase Admin initialized with service account");
    } catch (error) {
      console.error("Failed to parse Firebase service account:", error);
      console.warn("⚠ Firebase Admin not initialized - Firestore features will not work");
    }
  } else {
    console.warn("⚠ FIREBASE_SERVICE_ACCOUNT_KEY not found - Firebase Admin not initialized");
    console.warn("⚠ Firestore-dependent features (orders, menu management) will not work");
  }
}

export const adminDb = isInitialized ? admin.firestore() : null;
export const isFirebaseInitialized = isInitialized;
export default admin;
