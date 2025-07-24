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
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json();
      
      authManager.setCurrentUser(result.user);
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
              <div className="flex items-center justify-center mb-3">
                <CustomImageLogo src="/atm_sim_logo.png" size={40} className="mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 font-league-gothic">ATMSim</h1>
                  <p className="text-sm text-gray-500">Professional ATM Simulator</p>
                </div>
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
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </Label>
                <Input
                  {...form.register("username")}
                  placeholder="Enter your username"
                  className="w-full"
                />
                {form.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  PIN
                </Label>
                <Input
                  {...form.register("pin")}
                  type="password"
                  placeholder="Enter your 4-digit PIN"
                  maxLength={4}
                  className="w-full font-mono text-center text-lg tracking-widest"
                />
                {form.formState.errors.pin && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.pin.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium flex items-center justify-center"
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Access Account
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Demo Accounts:</h4>
              <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                <div><strong>User:</strong> demo1 <strong>PIN:</strong> 1234</div>
                <div><strong>User:</strong> demo2 <strong>PIN:</strong> 5678</div>
                <div><strong>User:</strong> muma <strong>PIN:</strong> 9999</div>
                <div><strong>User:</strong> alex <strong>PIN:</strong> 7890</div>
                <div><strong>User:</strong> sarah <strong>PIN:</strong> 4567</div>
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
