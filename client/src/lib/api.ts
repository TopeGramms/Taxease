export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function headers(token?: string) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSubscriptionStatus(token: string) {
  const res = await fetch(`${API_URL}/billing/status`, { headers: headers(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCheckout(token: string) {
  const res = await fetch(`${API_URL}/billing/checkout`, {
    method: "POST",
    headers: headers(token),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveResult(token: string, body: {
  mode: "2026" | "legacy";
  totalTax: number;
  afterTaxIncome: number;
  payload: unknown;
}) {
  const res = await fetch(`${API_URL}/results`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listResults(token: string) {
  const res = await fetch(`${API_URL}/results`, { headers: headers(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

