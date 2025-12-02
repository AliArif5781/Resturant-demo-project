import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FirestoreMenuItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  calories: string;
  protein: string;
  image: string;
  category: string;
  createdAt?: Date;
}

interface FirestoreMenuItemData {
  name: string;
  description: string;
  price: string;
  calories: string;
  protein: string;
  image: string;
  category: string;
  createdAt?: Timestamp;
}

const MENU_COLLECTION = "menuItems";

function convertTimestamp(data: FirestoreMenuItemData): Omit<FirestoreMenuItem, 'id'> {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || undefined,
  };
}

export async function getAllMenuItems(): Promise<FirestoreMenuItem[]> {
  const menuRef = collection(db, MENU_COLLECTION);
  const q = query(menuRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as FirestoreMenuItemData;
    return {
      id: docSnapshot.id,
      ...convertTimestamp(data),
    };
  });
}

export async function getMenuItemById(id: string): Promise<FirestoreMenuItem | null> {
  const docRef = doc(db, MENU_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const data = snapshot.data() as FirestoreMenuItemData;
  return {
    id: snapshot.id,
    ...convertTimestamp(data),
  };
}

export async function createMenuItem(
  item: Omit<FirestoreMenuItem, "id" | "createdAt">
): Promise<FirestoreMenuItem> {
  const menuRef = collection(db, MENU_COLLECTION);
  const docRef = await addDoc(menuRef, {
    ...item,
    createdAt: new Date(),
  });
  
  return {
    id: docRef.id,
    ...item,
  };
}

export async function updateMenuItem(
  id: string,
  data: Partial<Omit<FirestoreMenuItem, "id" | "createdAt">>
): Promise<FirestoreMenuItem> {
  const docRef = doc(db, MENU_COLLECTION, id);
  await updateDoc(docRef, data);
  
  const updated = await getDoc(docRef);
  const updatedData = updated.data() as FirestoreMenuItemData;
  return {
    id: updated.id,
    ...convertTimestamp(updatedData),
  };
}

export async function deleteMenuItem(id: string): Promise<void> {
  const docRef = doc(db, MENU_COLLECTION, id);
  await deleteDoc(docRef);
}
