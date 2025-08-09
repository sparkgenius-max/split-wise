import { relations } from "drizzle-orm/relations";
import { users, groups, groupMembers, expenses, expenseSplits, settlements } from "./schema";

export const groupsRelations = relations(groups, ({one, many}) => ({
	user: one(users, {
		fields: [groups.createdBy],
		references: [users.id]
	}),
	groupMembers: many(groupMembers),
	expenses: many(expenses),
	settlements: many(settlements),
}));

export const usersRelations = relations(users, ({many}) => ({
	groups: many(groups),
	groupMembers: many(groupMembers),
	expenses: many(expenses),
	expenseSplits: many(expenseSplits),
	settlements_fromUserId: many(settlements, {
		relationName: "settlements_fromUserId_users_id"
	}),
	settlements_toUserId: many(settlements, {
		relationName: "settlements_toUserId_users_id"
	}),
}));

export const groupMembersRelations = relations(groupMembers, ({one}) => ({
	group: one(groups, {
		fields: [groupMembers.groupId],
		references: [groups.id]
	}),
	user: one(users, {
		fields: [groupMembers.userId],
		references: [users.id]
	}),
}));

export const expensesRelations = relations(expenses, ({one, many}) => ({
	user: one(users, {
		fields: [expenses.paidBy],
		references: [users.id]
	}),
	group: one(groups, {
		fields: [expenses.groupId],
		references: [groups.id]
	}),
	expenseSplits: many(expenseSplits),
}));

export const expenseSplitsRelations = relations(expenseSplits, ({one}) => ({
	expense: one(expenses, {
		fields: [expenseSplits.expenseId],
		references: [expenses.id]
	}),
	user: one(users, {
		fields: [expenseSplits.userId],
		references: [users.id]
	}),
}));

export const settlementsRelations = relations(settlements, ({one}) => ({
	user_fromUserId: one(users, {
		fields: [settlements.fromUserId],
		references: [users.id],
		relationName: "settlements_fromUserId_users_id"
	}),
	user_toUserId: one(users, {
		fields: [settlements.toUserId],
		references: [users.id],
		relationName: "settlements_toUserId_users_id"
	}),
	group: one(groups, {
		fields: [settlements.groupId],
		references: [groups.id]
	}),
}));