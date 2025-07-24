import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

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

  logout() {
    this.setCurrentUser(null);
  }
}

export const authManager = new AuthManager();
