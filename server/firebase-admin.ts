import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      const parsedServiceAccount = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(parsedServiceAccount),
      });
      console.log("Firebase Admin initialized with service account");
    } catch (error) {
      console.error("Failed to parse Firebase service account:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
    }
  } else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required");
  }
}

export const adminDb = admin.firestore();
export default admin;
