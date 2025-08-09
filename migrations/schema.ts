import { pgTable, foreignKey, varchar, text, timestamp, numeric, index, jsonb, boolean, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const groups = pgTable("groups", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
	createdBy: varchar("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "groups_created_by_users_id_fk"
		}),
]);

export const groupMembers = pgTable("group_members", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	groupId: varchar("group_id").notNull(),
	userId: varchar("user_id").notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "group_members_group_id_groups_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "group_members_user_id_users_id_fk"
		}),
]);

export const expenses = pgTable("expenses", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	category: varchar(),
	imageUrl: varchar("image_url"),
	paidBy: varchar("paid_by").notNull(),
	groupId: varchar("group_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.paidBy],
			foreignColumns: [users.id],
			name: "expenses_paid_by_users_id_fk"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "expenses_group_id_groups_id_fk"
		}),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const expenseSplits = pgTable("expense_splits", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	expenseId: varchar("expense_id").notNull(),
	userId: varchar("user_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	settled: boolean().default(false),
	settledAt: timestamp("settled_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.expenseId],
			foreignColumns: [expenses.id],
			name: "expense_splits_expense_id_expenses_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "expense_splits_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	email: varchar(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	profileImageUrl: varchar("profile_image_url"),
	username: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const settlements = pgTable("settlements", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	fromUserId: varchar("from_user_id").notNull(),
	toUserId: varchar("to_user_id").notNull(),
	groupId: varchar("group_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.fromUserId],
			foreignColumns: [users.id],
			name: "settlements_from_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.toUserId],
			foreignColumns: [users.id],
			name: "settlements_to_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "settlements_group_id_groups_id_fk"
		}),
]);
