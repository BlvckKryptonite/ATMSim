import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { authManager } from "./lib/auth";
import { User } from "@shared/schema";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Deposit from "@/pages/deposit";
import Withdraw from "@/pages/withdraw";
import TransactionHistory from "@/pages/transaction-history";
import NotFound from "@/pages/not-found";

function Router() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setUser);
    setUser(authManager.getCurrentUser());
    return unsubscribe;
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/transactions" component={TransactionHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-100">
          <Router />
          <footer className="text-center mt-8 pb-4 text-sm text-gray-500">
            <p>Designed and Developed by <span className="font-medium text-blue-600">Muma K.</span></p>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
