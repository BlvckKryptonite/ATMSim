import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authManager } from "@/lib/auth";
import { Transaction, User } from "@shared/schema";
import { ArrowLeft, TrendingUp, TrendingDown, Eye } from "lucide-react";

export default function TransactionHistory() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setUser);
    setUser(authManager.getCurrentUser());
    return unsubscribe;
  }, []);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/users', user?.id, 'transactions'],
    enabled: !!user?.id,
  });

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const goBack = () => {
    setLocation('/');
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
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="mr-4 text-gray-500 hover:text-blue-600 p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                <p className="text-sm text-gray-600">Review your account activity</p>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-blue-600 text-white' : ''}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === 'deposit' ? 'default' : 'outline'}
                onClick={() => setFilter('deposit')}
                className={filter === 'deposit' ? 'bg-blue-600 text-white' : ''}
              >
                Deposits
              </Button>
              <Button
                size="sm"
                variant={filter === 'withdrawal' ? 'default' : 'outline'}
                onClick={() => setFilter('withdrawal')}
                className={filter === 'withdrawal' ? 'bg-blue-600 text-white' : ''}
              >
                Withdrawals
              </Button>
            </div>

            {/* Transaction List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
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
                        <p className="text-xs text-gray-500">Transaction ID: {transaction.referenceId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                      <p className="text-xs text-gray-500">Balance: {formatCurrency(transaction.balanceAfter)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transactions found</p>
                  {filter !== 'all' && (
                    <Button
                      variant="link"
                      onClick={() => setFilter('all')}
                      className="text-blue-600 text-sm mt-2"
                    >
                      Show all transactions
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
