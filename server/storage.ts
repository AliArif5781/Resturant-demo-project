import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
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
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
