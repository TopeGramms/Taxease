import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Shield, Save } from "lucide-react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";

export default function Account() {
  const { user, subscription, signIn, signUp, signOut, startCheckout, refreshSubscription } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Calculator</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo className="w-16 h-16" />
        </div>

        {!user ? (
          <>
            {/* Auth Card */}
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to access your saved calculations"
                    : "Join TaxEase to save your tax calculations"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Tab Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); }}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "login"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setError(null); }}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "register"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Register
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Benefits - Only show for register */}
            {mode === "register" && (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-foreground mb-4">Why create an account?</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Save className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Save your tax calculations for future reference</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Track your tax history over the years</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Your data is secure and encrypted</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Logged In State */
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Welcome!</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Subscription Status */}
              <div className={`p-4 rounded-lg border ${subscription?.status === "active"
                  ? "bg-green-50 border-green-200"
                  : "bg-muted/50 border-border"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subscription</span>
                  <span className={`text-sm font-semibold ${subscription?.status === "active" ? "text-green-600" : "text-muted-foreground"
                    }`}>
                    {subscription?.status === "active" ? "Active" : "Free Plan"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={refreshSubscription} variant="outline" size="sm">
                  Refresh Status
                </Button>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>

              {/* Upgrade CTA */}
              {subscription?.status !== "active" && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Upgrade to save unlimited calculations
                  </p>
                  <Button
                    onClick={startCheckout}
                    className="w-full h-12 text-base font-semibold"
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}

              {/* Back to Calculator */}
              <Button
                onClick={() => navigate("/app")}
                variant="ghost"
                className="w-full"
              >
                Go to Calculator
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
