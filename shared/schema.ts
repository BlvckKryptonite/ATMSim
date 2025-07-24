import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  pin: text("pin").notNull(),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'deposit' or 'withdrawal'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  referenceId: text("reference_id").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  pin: true,
  name: true,
  accountNumber: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  balanceAfter: true,
  referenceId: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  pin: z.string().length(4, "PIN must be exactly 4 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

export const transactionSchema = z.object({
  amount: z.string().transform((val) => parseFloat(val)).pipe(
    z.number().positive("Amount must be positive").min(0.01, "Minimum amount is $0.01")
  ),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type TransactionData = z.infer<typeof transactionSchema>;
