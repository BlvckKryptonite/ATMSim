import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, transactionSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for debugging
  app.get("/api/health", async (req, res) => {
    try {
      const hasDatabase = process.env.DATABASE_URL ? true : false;
      const testUser = await storage.getUserByUsername("demo1");
      res.json({ 
        status: "ok", 
        database: hasDatabase ? "connected" : "memory-storage",
        storage: testUser ? "working" : "no-data",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Authentication endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, pin } = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(username, pin);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or PIN" });
      }

      // Don't send PIN back to client
      const { pin: _, ...userWithoutPin } = user;
      res.json({ user: userWithoutPin });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Authentication failed" 
      });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { pin: _, ...userWithoutPin } = user;
      res.json(userWithoutPin);
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  // Deposit money
  app.post("/api/users/:id/deposit", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { amount } = transactionSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.balance);
      const newBalance = (currentBalance + amount).toFixed(2);
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(userId, newBalance);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update balance" });
      }

      // Create transaction record
      const referenceId = `TXN${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`;
      const transaction = await storage.createTransaction({
        userId,
        type: "deposit",
        amount: amount.toFixed(2),
        balanceAfter: newBalance,
        referenceId
      });

      const { pin: _, ...userWithoutPin } = updatedUser;
      res.json({ 
        user: userWithoutPin, 
        transaction: {
          ...transaction,
          timestamp: transaction.timestamp.toISOString()
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Withdraw money
  app.post("/api/users/:id/withdraw", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { amount } = transactionSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.balance);
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const newBalance = (currentBalance - amount).toFixed(2);
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(userId, newBalance);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update balance" });
      }

      // Create transaction record
      const referenceId = `TXN${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`;
      const transaction = await storage.createTransaction({
        userId,
        type: "withdrawal",
        amount: amount.toFixed(2),
        balanceAfter: newBalance,
        referenceId
      });

      const { pin: _, ...userWithoutPin } = updatedUser;
      res.json({ 
        user: userWithoutPin, 
        transaction: {
          ...transaction,
          timestamp: transaction.timestamp.toISOString()
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get user transactions
  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const transactions = await storage.getUserTransactions(userId);
      
      const formattedTransactions = transactions.map(tx => ({
        ...tx,
        timestamp: tx.timestamp.toISOString()
      }));
      
      res.json(formattedTransactions);
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
