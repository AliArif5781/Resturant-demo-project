import { adminDb, isFirebaseInitialized } from "./firebase-admin";
import admin from "firebase-admin";
import type { MenuItem, InsertMenuItem } from "@shared/schema";

const MENU_COLLECTION = "menuItems";

function ensureFirebaseInitialized() {
  if (!isFirebaseInitialized || !adminDb) {
    throw new Error("Firebase is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY.");
  }
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  ensureFirebaseInitialized();
  const snapshot = await adminDb!
    .collection(MENU_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      calories: data.calories,
      protein: data.protein,
      image: data.image,
      category: data.category,
      spicy: data.spicy || null,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as MenuItem;
  });
}

export async function getMenuItemById(id: string): Promise<MenuItem | undefined> {
  ensureFirebaseInitialized();
  const doc = await adminDb!.collection(MENU_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return undefined;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    calories: data.calories,
    protein: data.protein,
    image: data.image,
    category: data.category,
    spicy: data.spicy || null,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  } as MenuItem;
}

export async function createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
  ensureFirebaseInitialized();
  const now = admin.firestore.Timestamp.now();
  const docRef = await adminDb!.collection(MENU_COLLECTION).add({
    name: item.name,
    description: item.description,
    price: item.price,
    calories: item.calories,
    protein: item.protein,
    image: item.image,
    category: item.category,
    spicy: item.spicy || null,
    createdAt: now,
  });

  return {
    id: docRef.id,
    name: item.name,
    description: item.description,
    price: item.price,
    calories: item.calories,
    protein: item.protein,
    image: item.image,
    category: item.category,
    spicy: item.spicy || null,
    createdAt: now.toDate(),
  } as MenuItem;
}

export async function updateMenuItem(
  id: string,
  updateData: Partial<InsertMenuItem>
): Promise<MenuItem> {
  ensureFirebaseInitialized();
  const docRef = adminDb!.collection(MENU_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Menu item not found");
  }

  await docRef.update(updateData);

  const updatedDoc = await docRef.get();
  const data = updatedDoc.data()!;

  return {
    id: updatedDoc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    calories: data.calories,
    protein: data.protein,
    image: data.image,
    category: data.category,
    spicy: data.spicy || null,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  } as MenuItem;
}

export async function deleteMenuItem(id: string): Promise<void> {
  ensureFirebaseInitialized();
  const docRef = adminDb!.collection(MENU_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Menu item not found");
  }

  await docRef.delete();
}
