import {
  users,
  groups,
  groupMembers,
  expenses,
  expenseSplits,
  settlements,
  type User,
  type UpsertUser,
  type Group,
  type InsertGroup,
  type Expense,
  type InsertExpense,
  type GroupMember,
  type InsertGroupMember,
  type ExpenseSplit,
  type InsertExpenseSplit,
  type Settlement,
  type InsertSettlement,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, sum, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Group operations
  createGroup(group: InsertGroup): Promise<Group>;
  getUserGroups(userId: string): Promise<(Group & { members: User[]; memberCount: number; userBalance: number })[]>;
  getGroup(id: string): Promise<Group | undefined>;
  addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember>;
  getGroupMembers(groupId: string): Promise<User[]>;
  
  // Expense operations
  createExpense(expense: InsertExpense, splits: InsertExpenseSplit[]): Promise<Expense>;
  getGroupExpenses(groupId: string): Promise<(Expense & { paidBy: User; splits: (ExpenseSplit & { user: User })[] })[]>;
  getRecentExpenses(userId: string, limit?: number): Promise<(Expense & { paidBy: User; group: Group; userShare: number })[]>;
  
  // Balance operations
  getUserBalance(userId: string): Promise<number>;
  getGroupBalance(userId: string, groupId: string): Promise<number>;
  
  // Settlement operations
  createSettlement(settlement: InsertSettlement): Promise<Settlement>;
  getGroupSettlements(groupId: string): Promise<(Settlement & { fromUser: User; toUser: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Group operations
  async createGroup(groupData: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(groupData).returning();
    
    // Add creator as member
    await this.addGroupMember({ groupId: group.id, userId: groupData.createdBy });
    
    return group;
  }

  async getUserGroups(userId: string): Promise<(Group & { members: User[]; memberCount: number; userBalance: number })[]> {
    const userGroups = await db
      .select({ group: groups })
      .from(groupMembers)
      .innerJoin(groups, eq(groupMembers.groupId, groups.id))
      .where(eq(groupMembers.userId, userId));

    const result = [];
    for (const { group } of userGroups) {
      const members = await this.getGroupMembers(group.id);
      const userBalance = await this.getGroupBalance(userId, group.id);
      
      result.push({
        ...group,
        members,
        memberCount: members.length,
        userBalance,
      });
    }

    return result;
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values(groupMember).returning();
    return member;
  }

  async getGroupMembers(groupId: string): Promise<User[]> {
    const members = await db
      .select({ user: users })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId));

    return members.map(({ user }) => user);
  }

  // Expense operations
  async createExpense(expenseData: InsertExpense, splits: InsertExpenseSplit[]): Promise<Expense> {
    return await db.transaction(async (tx) => {
      const [expense] = await tx.insert(expenses).values(expenseData).returning();
      
      const splitsWithExpenseId = splits.map(split => ({
        ...split,
        expenseId: expense.id,
      }));
      
      await tx.insert(expenseSplits).values(splitsWithExpenseId);
      
      return expense;
    });
  }

  async getGroupExpenses(groupId: string): Promise<(Expense & { paidBy: User; splits: (ExpenseSplit & { user: User })[] })[]> {
    const groupExpenses = await db
      .select({
        expense: expenses,
        paidBy: users,
      })
      .from(expenses)
      .innerJoin(users, eq(expenses.paidBy, users.id))
      .where(eq(expenses.groupId, groupId))
      .orderBy(desc(expenses.createdAt));

    const result = [];
    for (const { expense, paidBy } of groupExpenses) {
      const splits = await db
        .select({
          split: expenseSplits,
          user: users,
        })
        .from(expenseSplits)
        .innerJoin(users, eq(expenseSplits.userId, users.id))
        .where(eq(expenseSplits.expenseId, expense.id));

      result.push({
        ...expense,
        paidBy,
        splits: splits.map(({ split, user }) => ({ ...split, user })),
      });
    }

    return result;
  }

  async getRecentExpenses(userId: string, limit = 10): Promise<(Expense & { paidBy: User; group: Group; userShare: number })[]> {
    // Get expenses where user is either the payer or has a split
    const userExpenses = await db
      .select({
        expense: expenses,
        paidBy: users,
        group: groups,
      })
      .from(expenses)
      .innerJoin(users, eq(expenses.paidBy, users.id))
      .innerJoin(groups, eq(expenses.groupId, groups.id))
      .innerJoin(expenseSplits, eq(expenseSplits.expenseId, expenses.id))
      .where(eq(expenseSplits.userId, userId))
      .orderBy(desc(expenses.createdAt))
      .limit(limit);

    const result = [];
    for (const { expense, paidBy, group } of userExpenses) {
      const [userSplit] = await db
        .select({ amount: expenseSplits.amount })
        .from(expenseSplits)
        .where(
          and(
            eq(expenseSplits.expenseId, expense.id),
            eq(expenseSplits.userId, userId)
          )
        );

      const userShare = userSplit ? parseFloat(userSplit.amount) : 0;
      // If user paid for the expense, their share is what they paid minus what they owe
      // If someone else paid, their share is just what they owe
      const actualShare = expense.paidBy === userId 
        ? parseFloat(expense.amount) - userShare 
        : -userShare;

      result.push({
        ...expense,
        paidBy,
        group,
        userShare: actualShare,
      });
    }

    return result;
  }

  // Balance operations
  async getUserBalance(userId: string): Promise<number> {
    // Amount user paid
    const [paidResult] = await db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(eq(expenses.paidBy, userId));

    // Amount user owes
    const [owesResult] = await db
      .select({ total: sum(expenseSplits.amount) })
      .from(expenseSplits)
      .where(eq(expenseSplits.userId, userId));

    const totalPaid = parseFloat(paidResult?.total || "0");
    const totalOwes = parseFloat(owesResult?.total || "0");

    return totalPaid - totalOwes;
  }

  async getGroupBalance(userId: string, groupId: string): Promise<number> {
    // Amount user paid in this group
    const [paidResult] = await db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidBy, userId),
          eq(expenses.groupId, groupId)
        )
      );

    // Amount user owes in this group
    const [owesResult] = await db
      .select({ total: sum(expenseSplits.amount) })
      .from(expenseSplits)
      .innerJoin(expenses, eq(expenseSplits.expenseId, expenses.id))
      .where(
        and(
          eq(expenseSplits.userId, userId),
          eq(expenses.groupId, groupId)
        )
      );

    const totalPaid = parseFloat(paidResult?.total || "0");
    const totalOwes = parseFloat(owesResult?.total || "0");

    return totalPaid - totalOwes;
  }

  // Settlement operations
  async createSettlement(settlementData: InsertSettlement): Promise<Settlement> {
    const [settlement] = await db.insert(settlements).values(settlementData).returning();
    return settlement;
  }

  async getGroupSettlements(groupId: string): Promise<(Settlement & { fromUser: User; toUser: User })[]> {
    const groupSettlements = await db
      .select({
        settlement: settlements,
        fromUser: users,
        toUser: users,
      })
      .from(settlements)
      .innerJoin(users, eq(settlements.fromUserId, users.id))
      .innerJoin(users, eq(settlements.toUserId, users.id))
      .where(eq(settlements.groupId, groupId))
      .orderBy(desc(settlements.createdAt));

    return groupSettlements.map(({ settlement, fromUser, toUser }) => ({
      ...settlement,
      fromUser,
      toUser,
    }));
  }
}

export const storage = new DatabaseStorage();
