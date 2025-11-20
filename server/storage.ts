import { type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  createOrder(order: InsertOrder): Promise<Order>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  getOrdersByUser(firebaseUid: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async upsertUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByFirebaseUid(insertUser.firebaseUid);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        email: insertUser.email,
        displayName: insertUser.displayName ?? null,
        photoURL: insertUser.photoURL ?? null,
        role: insertUser.role ?? existingUser.role,
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    }

    const id = randomUUID();
    const user: User = {
      id,
      firebaseUid: insertUser.firebaseUid,
      email: insertUser.email,
      displayName: insertUser.displayName ?? null,
      photoURL: insertUser.photoURL ?? null,
      role: insertUser.role ?? "user",
    };
    this.users.set(id, user);
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      firebaseUid: insertOrder.firebaseUid,
      userEmail: insertOrder.userEmail,
      userName: insertOrder.userName ?? null,
      items: insertOrder.items,
      subtotal: insertOrder.subtotal,
      tax: insertOrder.tax,
      total: insertOrder.total,
      status: insertOrder.status ?? "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const allOrders = Array.from(this.orders.values());
    return allOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getOrdersByUser(firebaseUid: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.firebaseUid === firebaseUid)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

import { PgStorage } from "./pgStorage";

export const storage = new PgStorage();
