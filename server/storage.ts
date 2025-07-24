import { users, transactions, type User, type InsertUser, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: number, newBalance: string): Promise<User | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  authenticateUser(username: string, pin: string): Promise<User | null>;
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
    const user: User = { ...insertUser, id };
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

export const storage = new MemStorage();
