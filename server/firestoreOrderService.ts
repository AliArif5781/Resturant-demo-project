import { adminDb } from "./firebase-admin";
import admin from "firebase-admin";
import type { Order, InsertOrder } from "@shared/schema";

const ORDERS_COLLECTION = "orders";

export async function createOrder(orderData: InsertOrder): Promise<Order> {
  const now = admin.firestore.Timestamp.now();
  const docRef = await adminDb.collection(ORDERS_COLLECTION).add({
    firebaseUid: orderData.firebaseUid,
    userEmail: orderData.userEmail,
    userName: orderData.userName || null,
    items: orderData.items,
    subtotal: orderData.subtotal,
    tax: orderData.tax,
    total: orderData.total,
    status: orderData.status || "pending",
    preparationTime: orderData.preparationTime || null,
    rejectionReason: orderData.rejectionReason || null,
    cancelledBy: orderData.cancelledBy || null,
    guestArrived: orderData.guestArrived || false,
    createdAt: now,
  });

  return {
    id: docRef.id,
    firebaseUid: orderData.firebaseUid,
    userEmail: orderData.userEmail,
    userName: orderData.userName || null,
    items: orderData.items,
    subtotal: String(orderData.subtotal),
    tax: String(orderData.tax),
    total: String(orderData.total),
    status: orderData.status || "pending",
    preparationTime: orderData.preparationTime || null,
    rejectionReason: orderData.rejectionReason || null,
    cancelledBy: orderData.cancelledBy || null,
    guestArrived: orderData.guestArrived || false,
    createdAt: now.toDate(),
  } as Order;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const doc = await adminDb.collection(ORDERS_COLLECTION).doc(orderId).get();

  if (!doc.exists) {
    return undefined;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    firebaseUid: data.firebaseUid,
    userEmail: data.userEmail,
    userName: data.userName || null,
    items: data.items,
    subtotal: String(data.subtotal),
    tax: String(data.tax),
    total: String(data.total),
    status: data.status,
    preparationTime: data.preparationTime || null,
    rejectionReason: data.rejectionReason || null,
    cancelledBy: data.cancelledBy || null,
    guestArrived: data.guestArrived || false,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  } as Order;
}

export async function getRecentOrders(limit: number = 50): Promise<Order[]> {
  const snapshot = await adminDb
    .collection(ORDERS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      firebaseUid: data.firebaseUid,
      userEmail: data.userEmail,
      userName: data.userName || null,
      items: data.items,
      subtotal: String(data.subtotal),
      tax: String(data.tax),
      total: String(data.total),
      status: data.status,
      preparationTime: data.preparationTime || null,
      rejectionReason: data.rejectionReason || null,
      cancelledBy: data.cancelledBy || null,
      guestArrived: data.guestArrived || false,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as Order;
  });
}

export async function getOrdersByUser(firebaseUid: string): Promise<Order[]> {
  const snapshot = await adminDb
    .collection(ORDERS_COLLECTION)
    .where("firebaseUid", "==", firebaseUid)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      firebaseUid: data.firebaseUid,
      userEmail: data.userEmail,
      userName: data.userName || null,
      items: data.items,
      subtotal: String(data.subtotal),
      tax: String(data.tax),
      total: String(data.total),
      status: data.status,
      preparationTime: data.preparationTime || null,
      rejectionReason: data.rejectionReason || null,
      cancelledBy: data.cancelledBy || null,
      guestArrived: data.guestArrived || false,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as Order;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  preparationTime?: string,
  rejectionReason?: string,
  cancelledBy?: string
): Promise<Order> {
  const validStatuses = ["pending", "preparing", "completed", "rejected", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`);
  }

  const docRef = adminDb.collection(ORDERS_COLLECTION).doc(orderId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Order not found");
  }

  const updateData: Record<string, any> = { status };
  
  if (status === "preparing") {
    updateData.preparationTime = preparationTime || null;
    updateData.rejectionReason = null;
    updateData.cancelledBy = null;
  } else if (status === "rejected") {
    updateData.rejectionReason = rejectionReason || null;
    updateData.preparationTime = null;
    updateData.cancelledBy = null;
  } else if (status === "cancelled") {
    updateData.cancelledBy = cancelledBy || null;
    updateData.preparationTime = null;
    updateData.rejectionReason = null;
  } else if (status === "completed") {
    updateData.preparationTime = null;
    updateData.rejectionReason = null;
    updateData.cancelledBy = null;
  } else if (status === "pending") {
    updateData.preparationTime = null;
    updateData.rejectionReason = null;
    updateData.cancelledBy = null;
  }

  await docRef.update(updateData);

  const updatedDoc = await docRef.get();
  const data = updatedDoc.data()!;

  return {
    id: updatedDoc.id,
    firebaseUid: data.firebaseUid,
    userEmail: data.userEmail,
    userName: data.userName || null,
    items: data.items,
    subtotal: String(data.subtotal),
    tax: String(data.tax),
    total: String(data.total),
    status: data.status,
    preparationTime: data.preparationTime || null,
    rejectionReason: data.rejectionReason || null,
    cancelledBy: data.cancelledBy || null,
    guestArrived: data.guestArrived || false,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  } as Order;
}

export async function updateGuestArrived(orderId: string, arrived: boolean): Promise<Order> {
  const docRef = adminDb.collection(ORDERS_COLLECTION).doc(orderId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Order not found");
  }

  await docRef.update({ guestArrived: arrived });

  const updatedDoc = await docRef.get();
  const data = updatedDoc.data()!;

  return {
    id: updatedDoc.id,
    firebaseUid: data.firebaseUid,
    userEmail: data.userEmail,
    userName: data.userName || null,
    items: data.items,
    subtotal: String(data.subtotal),
    tax: String(data.tax),
    total: String(data.total),
    status: data.status,
    preparationTime: data.preparationTime || null,
    rejectionReason: data.rejectionReason || null,
    cancelledBy: data.cancelledBy || null,
    guestArrived: data.guestArrived || false,
    createdAt: data.createdAt?.toDate?.() || new Date(),
  } as Order;
}
