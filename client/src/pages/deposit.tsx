import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { transactionSchema, type TransactionData, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ErrorModal } from "@/components/error-modal";
import { ReceiptModal } from "@/components/receipt-modal";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, PlusCircle, DollarSign, CheckCircle } from "lucide-react";

export default function Deposit() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setUser);
    setUser(authManager.getCurrentUser());
    return unsubscribe;
  }, []);

  const form = useForm<TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: TransactionData) => {
      if (!user) throw new Error("User not authenticated");
      const response = await apiRequest("POST", `/api/users/${user.id}/deposit`, data);
      return response.json();
    },
    onSuccess: (result) => {
      authManager.setCurrentUser(result.user);
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'transactions'] });
      
      const now = new Date();
      setReceiptData({
        type: 'deposit',
        amount: result.transaction.amount,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        accountNumber: result.user.accountNumber,
        newBalance: result.user.balance,
        referenceId: result.transaction.referenceId,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Deposit failed");
    },
  });

  const onSubmit = (data: TransactionData) => {
    setError(null);
    depositMutation.mutate(data);
  };

  const selectQuickAmount = (amount: number) => {
    form.setValue("amount", amount as any);
  };

  const goBack = () => {
    setLocation('/');
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
                <h2 className="text-xl font-semibold text-gray-900">Deposit Money</h2>
                <p className="text-sm text-gray-600">Add funds to your account</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PlusCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Amount to Deposit
                </Label>
                <Input
                  {...form.register("amount")}
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full font-mono text-lg text-center focus:ring-green-500 focus:border-green-500"
                />
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.amount.message}</p>
                )}
              </div>

              {/* Quick Amount Selection */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectQuickAmount(50)}
                  className="font-mono hover:bg-gray-50"
                >
                  $50
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectQuickAmount(100)}
                  className="font-mono hover:bg-gray-50"
                >
                  $100
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectQuickAmount(500)}
                  className="font-mono hover:bg-gray-50"
                >
                  $500
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium flex items-center justify-center"
                disabled={depositMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Deposit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {depositMutation.isPending && <LoadingOverlay />}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      {receiptData && (
        <ReceiptModal
          data={receiptData}
          onClose={() => {
            setReceiptData(null);
            setLocation('/');
          }}
        />
      )}
    </div>
  );
}
