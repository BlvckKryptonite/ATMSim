import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ErrorModal } from "@/components/error-modal";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { University, Lock, User, Key, LogIn } from "lucide-react";
import { VaultSimLogo, CustomImageLogo } from "@/components/logo";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      pin: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authManager.authenticateUser(data.username, data.pin);
      
      if (user) {
        authManager.setCurrentUser(user);
      } else {
        setError("Invalid username or PIN. Please check your credentials.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Card className="p-6 mb-4">
            <CardContent className="pt-0">
              <div className="flex flex-col items-center justify-center mb-3">
                <img src="/atm-sim-logo.png" alt="ATMSim Logo" className="h-16 mb-2" />
                <p className="text-sm text-gray-500">Professional ATM Simulator</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Lock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...form.register("username")}
                    placeholder="Enter your username"
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-in fade-in duration-200">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-blue-600" />
                  PIN
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...form.register("pin")}
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    maxLength={4}
                    className="pl-10 font-mono text-center text-lg tracking-widest transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                  />
                </div>
                {form.formState.errors.pin && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-in fade-in duration-200">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {form.formState.errors.pin.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium flex items-center justify-center transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Access Account
                  </>
                )}
              </Button>
            </form>

            {/* Forgot PIN Feature */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-blue-600 text-sm p-0 h-auto hover:underline"
                onClick={() => setError("Demo mode: All demo account PINs are listed below for testing purposes.")}
              >
                Forgot your PIN?
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Demo Accounts:
              </h4>
              <div className="text-sm space-y-2 max-h-32 overflow-y-auto">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span><strong>demo1</strong></span>
                  <span className="font-mono text-blue-600">1234</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span><strong>demo2</strong></span>
                  <span className="font-mono text-blue-600">5678</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span><strong>muma</strong></span>
                  <span className="font-mono text-blue-600">9999</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span><strong>alex</strong></span>
                  <span className="font-mono text-blue-600">7890</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span><strong>sarah</strong></span>
                  <span className="font-mono text-blue-600">4567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && <LoadingOverlay />}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
