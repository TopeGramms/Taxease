import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.resolve(process.cwd(), "server", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(path.join(dataDir, "data.sqlite"));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'active' | 'canceled' | 'none'
    stripeCustomerId TEXT,
    stripeSubscriptionId TEXT,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    mode TEXT NOT NULL,
    totalTax INTEGER NOT NULL,
    afterTaxIncome INTEGER NOT NULL,
    payload TEXT NOT NULL, -- JSON of inputs
    createdAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function createUser(email: string, passwordHash: string) {
  const createdAt = new Date().toISOString();
  const info = db
    .prepare("INSERT INTO users (email, passwordHash, createdAt) VALUES (?, ?, ?)")
    .run(email, passwordHash, createdAt);
  return db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
}

export function getSubscriptionForUser(userId: number) {
  return db.prepare("SELECT * FROM subscriptions WHERE userId = ?").get(userId);
}

export function upsertSubscription(sub: {
  userId: number;
  status: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const existing = getSubscriptionForUser(sub.userId);
  const now = new Date().toISOString();
  if (existing) {
    db.prepare(
      `UPDATE subscriptions
       SET status = ?, stripeCustomerId = ?, stripeSubscriptionId = ?, updatedAt = ?
       WHERE userId = ?`
    ).run(sub.status, sub.stripeCustomerId ?? null, sub.stripeSubscriptionId ?? null, now, sub.userId);
    return getSubscriptionForUser(sub.userId);
  } else {
    db.prepare(
      `INSERT INTO subscriptions (userId, status, stripeCustomerId, stripeSubscriptionId, updatedAt)
       VALUES (?, ?, ?, ?, ?)`
    ).run(sub.userId, sub.status, sub.stripeCustomerId ?? null, sub.stripeSubscriptionId ?? null, now);
    return getSubscriptionForUser(sub.userId);
  }
}

export function saveResult(userId: number, data: {
  mode: "2025" | "legacy",
  totalTax: number,
  afterTaxIncome: number,
  payload: unknown
}) {
  const createdAt = new Date().toISOString();
  db.prepare(
    "INSERT INTO results (userId, mode, totalTax, afterTaxIncome, payload, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(userId, data.mode, data.totalTax, data.afterTaxIncome, JSON.stringify(data.payload), createdAt);
}

export function listResults(userId: number) {
  return db.prepare("SELECT id, mode, totalTax, afterTaxIncome, payload, createdAt FROM results WHERE userId = ? ORDER BY id DESC").all(userId);
}

