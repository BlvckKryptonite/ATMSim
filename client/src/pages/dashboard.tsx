import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authManager } from "@/lib/auth";
import { Transaction, User } from "@shared/schema";
import { LogOut, Plus, Minus, Eye, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setUser);
    setUser(authManager.getCurrentUser());
    return unsubscribe;
  }, []);

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/users', user?.id, 'transactions'],
    enabled: !!user?.id,
  });

  const recentTransactions = transactions.slice(0, 3);

  const handleLogout = () => {
    authManager.logout();
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Account Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                  <p className="text-3xl font-bold font-mono">{formatCurrency(user.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm mb-1">Account</p>
                  <p className="font-mono text-sm">{user.accountNumber}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => setLocation('/deposit')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 h-auto flex flex-col items-center space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span className="font-medium">Deposit</span>
              </Button>
              <Button
                onClick={() => setLocation('/withdraw')}
                className="bg-red-500 hover:bg-red-600 text-white p-4 h-auto flex flex-col items-center space-y-2"
              >
                <Minus className="w-6 h-6" />
                <span className="font-medium">Withdraw</span>
              </Button>
            </div>

            {/* Recent Transactions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <Button
                  variant="link"
                  onClick={() => setLocation('/transactions')}
                  className="text-blue-600 text-sm p-0 h-auto hover:underline"
                >
                  View All
                </Button>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
