import { User } from "@shared/schema";

// Demo users for production deployment (client-side authentication)
const DEMO_USERS = [
  { id: 1, username: "demo1", pin: "1234", balance: "1250.75", fullName: "Demo User 1" },
  { id: 2, username: "demo2", pin: "5678", balance: "2100.50", fullName: "Demo User 2" },
  { id: 3, username: "muma", pin: "9999", balance: "5000.00", fullName: "Muma Kalobwe" },
  { id: 4, username: "alex", pin: "7890", balance: "800.25", fullName: "Alex Johnson" },
  { id: 5, username: "sarah", pin: "4567", balance: "3200.80", fullName: "Sarah Williams" }
] as const;

// Demo transactions for production
const DEMO_TRANSACTIONS = [
  { id: 1, userId: 3, type: "deposit" as const, amount: 500.00, timestamp: new Date("2025-01-20T10:30:00Z"), referenceId: "TXN-20250120-001" },
  { id: 2, userId: 3, type: "withdrawal" as const, amount: 200.00, timestamp: new Date("2025-01-19T14:15:00Z"), referenceId: "TXN-20250119-002" },
  { id: 3, userId: 3, type: "deposit" as const, amount: 1000.00, timestamp: new Date("2025-01-18T09:45:00Z"), referenceId: "TXN-20250118-003" },
  { id: 4, userId: 1, type: "deposit" as const, amount: 750.75, timestamp: new Date("2025-01-17T16:20:00Z"), referenceId: "TXN-20250117-004" },
  { id: 5, userId: 2, type: "withdrawal" as const, amount: 100.00, timestamp: new Date("2025-01-16T11:30:00Z"), referenceId: "TXN-20250116-005" }
];

// Production mode detection
const IS_PRODUCTION = import.meta.env.PROD;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private userTransactions: Map<number, any[]> = new Map();

  constructor() {
    // Initialize demo transactions
    DEMO_TRANSACTIONS.forEach(tx => {
      if (!this.userTransactions.has(tx.userId)) {
        this.userTransactions.set(tx.userId, []);
      }
      this.userTransactions.get(tx.userId)!.push(tx);
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.listeners.forEach(listener => listener(user));
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Client-side authentication for production
  async authenticateUser(username: string, pin: string): Promise<User | null> {
    if (IS_PRODUCTION) {
      const user = DEMO_USERS.find(u => u.username === username && u.pin === pin);
      return user || null;
    }
    
    // Development mode: use API
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  }

  // Client-side transaction handling for production
  async processTransaction(userId: number, type: 'deposit' | 'withdrawal', amount: number): Promise<boolean> {
    if (IS_PRODUCTION) {
      const user = DEMO_USERS.find(u => u.id === userId);
      if (!user) return false;

      const currentBalance = parseFloat(user.balance);
      const transactionAmount = parseFloat(amount.toString());
      
      if (type === 'withdrawal' && currentBalance < transactionAmount) return false;

      const newBalance = type === 'deposit' 
        ? (currentBalance + transactionAmount).toFixed(2)
        : (currentBalance - transactionAmount).toFixed(2);

      // Update user balance (mutate the demo data)
      (user as any).balance = newBalance;

      // Add transaction with string amount for consistency
      const newTransaction = {
        id: Date.now(),
        userId,
        type,
        amount: transactionAmount.toFixed(2),
        timestamp: new Date(),
        referenceId: `TXN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString().slice(2, 5)}`,
        balanceAfter: newBalance
      };

      if (!this.userTransactions.has(userId)) {
        this.userTransactions.set(userId, []);
      }
      this.userTransactions.get(userId)!.unshift(newTransaction);

      // Update current user if it's the same user and notify all subscribers
      if (this.currentUser && this.currentUser.id === userId) {
        const updatedUser = { ...this.currentUser, balance: newBalance };
        this.currentUser = updatedUser;
        this.notifyListeners(updatedUser);
      }

      return true;
    }

    // Development mode: use API
    try {
      const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      const response = await fetch(`/api/users/${userId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update current user balance after successful API call
        if (this.currentUser && this.currentUser.id === userId && data.user) {
          const updatedUser = { ...this.currentUser, balance: data.user.balance };
          this.currentUser = updatedUser;
          this.notifyListeners(updatedUser);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Get user transactions
  async getUserTransactions(userId: number): Promise<any[]> {
    if (IS_PRODUCTION) {
      return this.userTransactions.get(userId) || [];
    }

    // Development mode: use API
    try {
      const response = await fetch(`/api/users/${userId}/transactions`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  }

  logout() {
    this.setCurrentUser(null);
  }
}

export const authManager = new AuthManager();
