import { users, transactions, type User, type InsertUser, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: number, newBalance: string): Promise<User | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  authenticateUser(username: string, pin: string): Promise<User | null>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserBalance(id: number, newBalance: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    if (!db) throw new Error("Database not available");
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.timestamp));
  }

  async authenticateUser(username: string, pin: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.pin === pin) {
      return user;
    }
    return null;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    
    // Initialize with demo users
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUsers = [
      {
        username: "demo1",
        pin: "1234",
        name: "John Smith",
        accountNumber: "****1234",
        balance: "2548.76"
      },
      {
        username: "demo2",
        pin: "5678",
        name: "Jane Doe",
        accountNumber: "****5678",
        balance: "1875.50"
      },
      {
        username: "muma",
        pin: "9999",
        name: "Muma Kalobwe",
        accountNumber: "****9999",
        balance: "5432.10"
      },
      {
        username: "alex",
        pin: "7890",
        name: "Alex Johnson",
        accountNumber: "****7890",
        balance: "3210.25"
      },
      {
        username: "sarah",
        pin: "4567",
        name: "Sarah Williams",
        accountNumber: "****4567",
        balance: "1987.65"
      }
    ];

    demoUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        ...userData
      };
      this.users.set(user.id, user);

      // Add some demo transactions
      const demoTransactions = [
        {
          userId: user.id,
          type: "deposit",
          amount: "500.00",
          balanceAfter: user.balance,
          referenceId: `TXN${String(this.currentTransactionId).padStart(6, '0')}`,
          timestamp: new Date()
        },
        {
          userId: user.id,
          type: "withdrawal",
          amount: "200.00",
          balanceAfter: (parseFloat(user.balance) - 200).toFixed(2),
          referenceId: `TXN${String(this.currentTransactionId + 1).padStart(6, '0')}`,
          timestamp: new Date(Date.now() - 86400000) // Yesterday
        }
      ];

      demoTransactions.forEach(txData => {
        const transaction: Transaction = {
          id: this.currentTransactionId++,
          ...txData
        };
        this.transactions.set(transaction.id, transaction);
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      balance: insertUser.balance || "0.00"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      timestamp: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async authenticateUser(username: string, pin: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.pin === pin) {
      return user;
    }
    return null;
  }
}

// For production deployment, use in-memory storage to avoid serverless function crashes
// TODO: Switch back to database storage once Vercel environment is properly configured
const storage: IStorage = new MemStorage();
console.log("📝 Using in-memory storage for production deployment");

export { storage };
