import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertMenuItemSchema } from "@shared/schema";
import { upload, uploadToCloudinary } from "./cloudinary";
import * as firestoreMenu from "./firestoreMenuService";
import * as firestoreOrder from "./firestoreOrderService";

export async function registerRoutes(app: Express): Promise<Server> {
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim())
    .filter(Boolean);

  console.log("Configured admin emails:", ADMIN_EMAILS);

  // User sync endpoint - creates or updates user from Firebase auth
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { firebaseUid, email, displayName, photoURL, role } = req.body;

      if (!firebaseUid || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let validatedRole = role;
      
      if (role === "admin") {
        const isAdminEmail = ADMIN_EMAILS.includes(email);
        console.log(`Admin check - Email: ${email}, Is Admin: ${isAdminEmail}, Admin Emails:`, ADMIN_EMAILS);
        if (!isAdminEmail) {
          validatedRole = "user";
        }
      }

      const userPayload: any = {
        firebaseUid,
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
      };

      if (validatedRole !== undefined) {
        userPayload.role = validatedRole;
      }

      const user = await storage.upsertUser(userPayload);

      console.log(`User synced - Email: ${email}, Role: ${user.role}`);

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get current user by Firebase UID
  app.get("/api/auth/user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent caching to ensure fresh role data
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      console.log(`Retrieved user - Email: ${user.email}, Role: ${user.role}`);

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new order - Uses Firestore
  app.post("/api/orders", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists in our system
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Use server-verified user data instead of trusting client
      const orderData = {
        firebaseUid: user.firebaseUid,
        userEmail: user.email,
        userName: user.displayName,
        items: req.body.items,
        subtotal: req.body.subtotal,
        tax: req.body.tax,
        total: req.body.total,
        status: "pending",
      };

      const validatedOrder = insertOrderSchema.parse(orderData);
      const order = await firestoreOrder.createOrder(validatedOrder);
      res.json({ order });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get recent orders (for admin dashboard - ADMIN ONLY) - Uses Firestore
  app.get("/api/orders", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const orders = await firestoreOrder.getRecentOrders(limit);
      res.json({ orders });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get orders by user - Uses Firestore
  app.get("/api/orders/user/:firebaseUid", async (req, res) => {
    try {
      const requestingUid = req.headers["x-firebase-uid"] as string;
      const { firebaseUid } = req.params;
      
      if (!requestingUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Users can only see their own orders, admins can see anyone's
      const user = await storage.getUserByFirebaseUid(requestingUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin" && requestingUid !== firebaseUid) {
        return res.status(403).json({ message: "Access denied" });
      }

      const orders = await firestoreOrder.getOrdersByUser(firebaseUid);
      res.json({ orders });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single order by ID - Uses Firestore
  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { orderId } = req.params;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const order = await firestoreOrder.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Users can only see their own orders, admins can see any order
      if (user.role !== "admin" && order.firebaseUid !== firebaseUid) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ order });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update order status (ADMIN ONLY) - Uses Firestore
  app.patch("/api/orders/:orderId/status", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { orderId } = req.params;
      const { status, preparationTime, rejectionReason } = req.body;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      // Require preparation time when updating to "preparing" status
      const trimmedPrepTime = preparationTime?.trim();
      if (status === "preparing" && !trimmedPrepTime) {
        return res.status(400).json({ message: "Preparation time is required when updating to preparing status" });
      }

      // Require rejection reason when updating to "rejected" status
      const trimmedRejectionReason = rejectionReason?.trim();
      if (status === "rejected" && !trimmedRejectionReason) {
        return res.status(400).json({ message: "Rejection reason is required when rejecting an order" });
      }

      // Clear stale fields based on status transitions
      const finalPrepTime = status === "preparing" ? trimmedPrepTime : undefined;
      const finalRejectionReason = status === "rejected" ? trimmedRejectionReason : undefined;
      const finalCancelledBy = status === "cancelled" ? "admin" : undefined;

      const updatedOrder = await firestoreOrder.updateOrderStatus(orderId, status, finalPrepTime, finalRejectionReason, finalCancelledBy);
      res.json({ order: updatedOrder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Mark guest as arrived - Uses Firestore
  app.patch("/api/orders/:orderId/arrived", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { orderId } = req.params;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Get the order to verify ownership
      const order = await firestoreOrder.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only the order owner can mark themselves as arrived
      if (order.firebaseUid !== firebaseUid) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedOrder = await firestoreOrder.updateGuestArrived(orderId, true);
      res.json({ order: updatedOrder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cancel order (USER - own orders only, and only if status is pending) - Uses Firestore
  app.patch("/api/orders/:orderId/cancel", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { orderId } = req.params;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Get the order to verify ownership and status
      const order = await firestoreOrder.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only the order owner can cancel their own order
      if (order.firebaseUid !== firebaseUid) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Can only cancel pending orders
      if (order.status !== "pending") {
        return res.status(400).json({ 
          message: `Cannot cancel order with status "${order.status}". Only pending orders can be cancelled.` 
        });
      }

      const updatedOrder = await firestoreOrder.updateOrderStatus(orderId, "cancelled", undefined, undefined, "guest");
      res.json({ order: updatedOrder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========== IMAGE UPLOAD ROUTE ==========

  // Upload image to Cloudinary (ADMIN ONLY)
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer, "karahi-point-menu");
      res.json({ url: imageUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });

  // ========== MENU ITEMS ROUTES ==========

  // Get all menu items (public) - Uses Firestore
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await firestoreMenu.getAllMenuItems();
      res.json({ items });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single menu item by ID (public) - Uses Firestore
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await firestoreMenu.getMenuItemById(id);
      
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json({ item });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new menu item (ADMIN ONLY) - Uses Firestore
  app.post("/api/menu-items", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedItem = insertMenuItemSchema.parse(req.body);
      const item = await firestoreMenu.createMenuItem(validatedItem);
      res.json({ item });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update menu item (ADMIN ONLY) - Uses Firestore
  app.patch("/api/menu-items/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { id } = req.params;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Validate the update data using partial schema
      const updateSchema = insertMenuItemSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const item = await firestoreMenu.updateMenuItem(id, validatedData);
      res.json({ item });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete menu item (ADMIN ONLY) - Uses Firestore
  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers["x-firebase-uid"] as string;
      const { id } = req.params;
      
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify user exists and is admin
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      await firestoreMenu.deleteMenuItem(id);
      res.json({ message: "Menu item deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
