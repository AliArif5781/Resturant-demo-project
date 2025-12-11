import { z } from "zod";

// User types
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: string;
}

export const insertUserSchema = z.object({
  firebaseUid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  photoURL: z.string().nullable().optional(),
  role: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Order types
export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  firebaseUid: string;
  userEmail: string;
  userName: string | null;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  total: string;
  status: string;
  preparationTime: string | null;
  rejectionReason: string | null;
  cancelledBy: string | null;
  guestArrived: boolean;
  createdAt: Date;
  acceptedAt?: Date | null;
}

export const insertOrderSchema = z.object({
  firebaseUid: z.string(),
  userEmail: z.string().email(),
  userName: z.string().nullable().optional(),
  items: z.any(),
  subtotal: z.union([z.string(), z.number()]),
  tax: z.union([z.string(), z.number()]),
  total: z.union([z.string(), z.number()]),
  status: z.string().optional(),
  preparationTime: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  cancelledBy: z.string().nullable().optional(),
  guestArrived: z.boolean().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Menu Item types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  calories: string;
  protein: string;
  image: string;
  category: string;
  spicy?: string | null;
  createdAt: Date;
}

export const insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.string(), z.number()]),
  calories: z.union([z.string(), z.number()]),
  protein: z.union([z.string(), z.number()]),
  image: z.string().min(1),
  category: z.string().min(1),
  spicy: z.string().nullable().optional(),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
