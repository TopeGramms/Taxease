import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSubscriptionStatus, login, register, createCheckout } from "@/lib/api";

interface User {
  id: number;
  email: string;
}

interface Subscription {
  status: "active" | "canceled" | "none";
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  subscription: Subscription | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshSubscription: () => Promise<void>;
  startCheckout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("taxease-auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
        setSubscription(parsed.subscription);
      } catch {}
    }
    setLoading(false);
  }, []);

  const persist = (u: User | null, t: string | null, s: Subscription | null) => {
    setUser(u);
    setToken(t);
    setSubscription(s);
    if (u && t) {
      localStorage.setItem("taxease-auth", JSON.stringify({ user: u, token: t, subscription: s }));
    } else {
      localStorage.removeItem("taxease-auth");
    }
  };

  const signIn = async (email: string, password: string) => {
    const resp = await login(email, password);
    persist(resp.user, resp.token, resp.subscription);
  };

  const signUp = async (email: string, password: string) => {
    const resp = await register(email, password);
    persist(resp.user, resp.token, resp.subscription);
  };

  const signOut = () => {
    persist(null, null, null);
  };

  const refreshSubscription = async () => {
    if (!token) return;
    const resp = await getSubscriptionStatus(token);
    const sub = resp.subscription as Subscription;
    persist(user, token, sub);
  };

  const startCheckout = async () => {
    if (!token) throw new Error("Not authenticated");
    const resp = await createCheckout(token);
    const url = resp.url as string;
    if (url.startsWith("/")) {
      // Mock mode - local success route
      window.location.href = url;
    } else {
      window.location.href = url;
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user, token, subscription, loading,
    signIn, signUp, signOut, refreshSubscription, startCheckout
  }), [user, token, subscription, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

