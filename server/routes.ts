import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User sync endpoint - creates or updates user from Firebase auth
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { firebaseUid, email, displayName, photoURL, role } = req.body;

      if (!firebaseUid || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await storage.upsertUser({
        firebaseUid,
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
        role: role || "user",
      });

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
