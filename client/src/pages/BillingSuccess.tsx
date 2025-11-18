import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function BillingSuccess() {
  const { refreshSubscription } = useAuth();
  useEffect(() => {
    refreshSubscription().catch(() => {});
  }, []);
  return (
    <div className="max-w-md mx-auto p-6 text-center space-y-3">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
      <p className="text-sm text-muted-foreground">Your subscription is now active. You can save results.</p>
    </div>
  );
}

