import { adminDb, isFirebaseInitialized } from "./firebase-admin";
import type { User, InsertUser } from "@shared/schema";

const USERS_COLLECTION = "users";

function ensureFirebaseInitialized() {
  if (!isFirebaseInitialized || !adminDb) {
    throw new Error("Firebase is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY.");
  }
}

export async function getUser(id: string): Promise<User | undefined> {
  ensureFirebaseInitialized();
  const doc = await adminDb!.collection(USERS_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return undefined;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    firebaseUid: data.firebaseUid,
    email: data.email,
    displayName: data.displayName || null,
    photoURL: data.photoURL || null,
    role: data.role || "user",
  } as User;
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
  ensureFirebaseInitialized();
  const snapshot = await adminDb!
    .collection(USERS_COLLECTION)
    .where("firebaseUid", "==", firebaseUid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return undefined;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    firebaseUid: data.firebaseUid,
    email: data.email,
    displayName: data.displayName || null,
    photoURL: data.photoURL || null,
    role: data.role || "user",
  } as User;
}

export async function upsertUser(insertUser: InsertUser): Promise<User> {
  ensureFirebaseInitialized();
  
  const existingUser = await getUserByFirebaseUid(insertUser.firebaseUid);

  if (existingUser) {
    const updateData: Partial<User> = {
      email: insertUser.email,
      displayName: insertUser.displayName ?? null,
      photoURL: insertUser.photoURL ?? null,
    };
    
    if (insertUser.role !== undefined) {
      updateData.role = insertUser.role;
    }

    await adminDb!.collection(USERS_COLLECTION).doc(existingUser.id).update(updateData);

    return {
      ...existingUser,
      ...updateData,
      role: insertUser.role ?? existingUser.role,
    } as User;
  }

  const docRef = await adminDb!.collection(USERS_COLLECTION).add({
    firebaseUid: insertUser.firebaseUid,
    email: insertUser.email,
    displayName: insertUser.displayName ?? null,
    photoURL: insertUser.photoURL ?? null,
    role: insertUser.role ?? "user",
  });

  return {
    id: docRef.id,
    firebaseUid: insertUser.firebaseUid,
    email: insertUser.email,
    displayName: insertUser.displayName ?? null,
    photoURL: insertUser.photoURL ?? null,
    role: insertUser.role ?? "user",
  } as User;
}
