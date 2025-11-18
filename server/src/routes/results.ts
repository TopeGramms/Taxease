import { Router } from "express";
import { authMiddleware } from "../auth";
import { getSubscriptionForUser, listResults, saveResult } from "../db";

const router = Router();

router.use(authMiddleware);

router.get("/", (req: any, res) => {
  const results = listResults(req.user.id);
  return res.json({ results });
});

router.post("/", (req: any, res) => {
  const sub = getSubscriptionForUser(req.user.id);
  if (!sub || sub.status !== "active") {
    return res.status(402).json({ error: "Payment Required: active subscription needed to save results" });
  }
  const { mode, totalTax, afterTaxIncome, payload } = req.body as {
    mode: "2025" | "legacy";
    totalTax: number;
    afterTaxIncome: number;
    payload: unknown;
  };
  if (!mode || typeof totalTax !== "number" || typeof afterTaxIncome !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }
  saveResult(req.user.id, { mode, totalTax, afterTaxIncome, payload });
  return res.json({ ok: true });
});

export default router;

