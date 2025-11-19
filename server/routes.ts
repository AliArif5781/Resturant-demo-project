import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
