import { type User, type InsertUser, type Order, type InsertOrder, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private menuItems: Map<string, MenuItem>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.menuItems = new Map();
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
      preparationTime: insertOrder.preparationTime ?? null,
      rejectionReason: insertOrder.rejectionReason ?? null,
      cancelledBy: insertOrder.cancelledBy ?? null,
      guestArrived: insertOrder.guestArrived ?? false,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
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

  async updateOrderStatus(orderId: string, status: string, preparationTime?: string, rejectionReason?: string, cancelledBy?: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    const updatedOrder = { 
      ...order, 
      status, 
      // Only keep preparationTime if explicitly provided, otherwise clear it
      preparationTime: preparationTime !== undefined ? preparationTime : null,
      // Only keep rejectionReason if explicitly provided, otherwise clear it
      rejectionReason: rejectionReason !== undefined ? rejectionReason : null,
      // Clear cancelledBy when moving away from cancelled status, or set it if explicitly provided
      cancelledBy: cancelledBy !== undefined ? cancelledBy : (status === "cancelled" ? order.cancelledBy : null)
    };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async updateGuestArrived(orderId: string, arrived: boolean): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    const updatedOrder = { ...order, guestArrived: arrived };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const menuItem: MenuItem = {
      id,
      name: insertMenuItem.name,
      description: insertMenuItem.description,
      price: insertMenuItem.price,
      calories: insertMenuItem.calories,
      protein: insertMenuItem.protein,
      image: insertMenuItem.image,
      category: insertMenuItem.category,
      createdAt: new Date(),
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async updateMenuItem(id: string, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const menuItem = this.menuItems.get(id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    const updatedItem = { ...menuItem, ...updateData };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: string): Promise<void> {
    if (!this.menuItems.has(id)) {
      throw new Error("Menu item not found");
    }
    this.menuItems.delete(id);
  }
}

import { PgStorage } from "./pgStorage";

export const storage = new PgStorage();
