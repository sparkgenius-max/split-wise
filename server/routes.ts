import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertGroupSchema, insertExpenseSchema, insertGroupMemberSchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Group routes
  app.post('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupData = insertGroupSchema.parse({ ...req.body, createdBy: userId });
      
      const group = await storage.createGroup(groupData);
      res.json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.get('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groups = await storage.getUserGroups(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.get('/api/groups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const group = await storage.getGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      const members = await storage.getGroupMembers(group.id);
      const expenses = await storage.getGroupExpenses(group.id);
      
      res.json({ ...group, members, expenses });
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  app.post('/api/groups/:id/members', isAuthenticated, async (req: any, res) => {
    try {
      const memberData = insertGroupMemberSchema.parse({
        groupId: req.params.id,
        userId: req.body.userId,
      });
      
      const member = await storage.addGroupMember(memberData);
      res.json(member);
    } catch (error) {
      console.error("Error adding group member:", error);
      res.status(500).json({ message: "Failed to add group member" });
    }
  });

  // Expense routes
  app.post('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { splits, ...expenseData } = req.body;
      
      const validatedExpense = insertExpenseSchema.parse({
        ...expenseData,
        paidBy: userId,
      });

      const expense = await storage.createExpense(validatedExpense, splits);
      res.json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.get('/api/expenses/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const expenses = await storage.getRecentExpenses(userId, limit);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
      res.status(500).json({ message: "Failed to fetch recent expenses" });
    }
  });

  // Balance routes
  app.get('/api/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getUserBalance(userId);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  app.get('/api/balance/group/:groupId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getGroupBalance(userId, req.params.groupId);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching group balance:", error);
      res.status(500).json({ message: "Failed to fetch group balance" });
    }
  });

  // Settlement routes
  app.post('/api/settlements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settlementData = {
        ...req.body,
        fromUserId: userId,
      };
      
      const settlement = await storage.createSettlement(settlementData);
      res.json(settlement);
    } catch (error) {
      console.error("Error creating settlement:", error);
      res.status(500).json({ message: "Failed to create settlement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
