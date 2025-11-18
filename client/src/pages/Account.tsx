import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Account() {
  const { user, subscription, signIn, signUp, signOut, startCheckout, refreshSubscription } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Account</h1>

      {!user ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 px-4 py-2 rounded ${mode === "login" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 px-4 py-2 rounded ${mode === "register" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 text-base font-semibold">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded border">
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Subscription: {subscription?.status ?? "none"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button onClick={refreshSubscription} variant="outline">Refresh Status</Button>
            <Button onClick={signOut} variant="outline">Sign Out</Button>
          </div>

          {subscription?.status !== "active" && (
            <Button onClick={startCheckout} className="w-full h-12 text-base font-semibold">
              Upgrade to Save Results
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

