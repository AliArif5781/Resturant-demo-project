import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { users, orders, menuItems, type User, type InsertUser, type Order, type InsertOrder, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { IStorage } from "./storage";

export class PgStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));
    return result[0];
  }

  async upsertUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByFirebaseUid(insertUser.firebaseUid);

    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({
          email: insertUser.email,
          displayName: insertUser.displayName ?? null,
          photoURL: insertUser.photoURL ?? null,
          role: insertUser.role ?? existingUser.role,
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    }

    const [newUser] = await db
      .insert(users)
      .values({
        firebaseUid: insertUser.firebaseUid,
        email: insertUser.email,
        displayName: insertUser.displayName ?? null,
        photoURL: insertUser.photoURL ?? null,
        role: insertUser.role ?? "user",
      })
      .returning();
    return newUser;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return newOrder;
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
    return result[0];
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const result = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
    return result;
  }

  async getOrdersByUser(firebaseUid: string): Promise<Order[]> {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.firebaseUid, firebaseUid))
      .orderBy(desc(orders.createdAt));
    return result;
  }

  async updateOrderStatus(orderId: string, status: string, preparationTime?: string, rejectionReason?: string, cancelledBy?: string): Promise<Order> {
    const updateData: { status: string; preparationTime: string | null; rejectionReason: string | null; cancelledBy?: string | null } = { 
      status,
      // Clear preparationTime unless explicitly provided
      preparationTime: preparationTime !== undefined ? preparationTime : null,
      // Clear rejectionReason unless explicitly provided
      rejectionReason: rejectionReason !== undefined ? rejectionReason : null
    };
    
    // Handle cancelledBy: set it if provided, or clear it when moving away from cancelled status
    if (cancelledBy !== undefined) {
      updateData.cancelledBy = cancelledBy;
    } else if (status !== "cancelled") {
      updateData.cancelledBy = null;
    }
    
    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();
    
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    
    return updatedOrder;
  }

  async updateGuestArrived(orderId: string, arrived: boolean): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ guestArrived: arrived })
      .where(eq(orders.id, orderId))
      .returning();
    
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    
    return updatedOrder;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db
      .insert(menuItems)
      .values(insertMenuItem)
      .returning();
    return newMenuItem;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    const result = await db
      .select()
      .from(menuItems)
      .orderBy(desc(menuItems.createdAt));
    return result;
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const result = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));
    return result[0];
  }

  async updateMenuItem(id: string, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    
    if (!updatedMenuItem) {
      throw new Error("Menu item not found");
    }
    
    return updatedMenuItem;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Menu item not found");
    }
  }
}
