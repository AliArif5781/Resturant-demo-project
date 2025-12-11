import { type User, type InsertUser, type Order, type InsertOrder, type MenuItem, type InsertMenuItem } from "@shared/schema";
import * as firestoreUser from "./firestoreUserService";
import * as firestoreOrder from "./firestoreOrderService";
import * as firestoreMenu from "./firestoreMenuService";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  getOrdersByUser(firebaseUid: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string, preparationTime?: string, rejectionReason?: string, cancelledBy?: string): Promise<Order>;
  updateGuestArrived(orderId: string, arrived: boolean): Promise<Order>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;
}

export class FirestoreStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return firestoreUser.getUser(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return firestoreUser.getUserByFirebaseUid(firebaseUid);
  }

  async upsertUser(insertUser: InsertUser): Promise<User> {
    return firestoreUser.upsertUser(insertUser);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    return firestoreOrder.createOrder(insertOrder);
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return firestoreOrder.getOrderById(orderId);
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return firestoreOrder.getRecentOrders(limit);
  }

  async getOrdersByUser(firebaseUid: string): Promise<Order[]> {
    return firestoreOrder.getOrdersByUser(firebaseUid);
  }

  async updateOrderStatus(orderId: string, status: string, preparationTime?: string, rejectionReason?: string, cancelledBy?: string): Promise<Order> {
    return firestoreOrder.updateOrderStatus(orderId, status, preparationTime, rejectionReason, cancelledBy);
  }

  async updateGuestArrived(orderId: string, arrived: boolean): Promise<Order> {
    return firestoreOrder.updateGuestArrived(orderId, arrived);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    return firestoreMenu.createMenuItem(insertMenuItem);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return firestoreMenu.getAllMenuItems();
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    return firestoreMenu.getMenuItemById(id);
  }

  async updateMenuItem(id: string, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    return firestoreMenu.updateMenuItem(id, updateData);
  }

  async deleteMenuItem(id: string): Promise<void> {
    return firestoreMenu.deleteMenuItem(id);
  }
}

export const storage = new FirestoreStorage();
