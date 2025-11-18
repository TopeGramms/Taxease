import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtUser {
  id: number;
  email: string;
}

export function signJwt(user: JwtUser) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign(user, secret, { expiresIn: "7d" });
}

export function authMiddleware(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length);
  try {
    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

