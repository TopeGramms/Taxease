import { Router } from "express";
import { createUser, getSubscriptionForUser, getUserByEmail, upsertSubscription } from "../db";
import bcrypt from "bcryptjs";
import { signJwt } from "../auth";

const router = Router();

router.post("/register", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (getUserByEmail(email)) return res.status(409).json({ error: "Email already registered" });
  const hash = bcrypt.hashSync(password, 10);
  const user = createUser(email, hash);
  // Default: no subscription
  upsertSubscription({ userId: user.id, status: "none" });
  const token = signJwt({ id: user.id, email: user.email });
  const sub = getSubscriptionForUser(user.id);
  return res.json({ token, user: { id: user.id, email: user.email }, subscription: sub });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const user = getUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signJwt({ id: user.id, email: user.email });
  const sub = getSubscriptionForUser(user.id);
  return res.json({ token, user: { id: user.id, email: user.email }, subscription: sub });
});

export default router;

